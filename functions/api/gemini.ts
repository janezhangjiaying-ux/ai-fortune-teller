export const onRequestPost = async (context: any) => {
  const apiKey = context.env?.GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY on server" }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }

  try {
    const body = await context.request.json();
    const { model, contents, config } = body || {};

    if (!model || !contents) {
      return new Response(JSON.stringify({ error: "Missing model or contents" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const normalizedContents =
      typeof contents === "string"
        ? [{ role: "user", parts: [{ text: contents }] }]
        : contents;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: normalizedContents,
          generationConfig: config || undefined
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: errorBody?.error?.message || "AI分析服务暂时不可用，请稍后重试。" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = (data?.candidates || [])
      .flatMap((candidate: any) => candidate?.content?.parts || [])
      .map((part: any) => part?.text || "")
      .join("");

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "AI分析服务暂时不可用，请稍后重试。" }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};
