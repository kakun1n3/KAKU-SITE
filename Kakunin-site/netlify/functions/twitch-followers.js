exports.handler = async function () {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const broadcasterId = process.env.TWITCH_BROADCASTER_ID;

  try {
    // トークン取得
    const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });

    const tokenData = await tokenRes.json();

    // フォロワー取得
    const res = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`,
      {
        headers: {
          "Client-Id": clientId,
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ total: data.total }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "failed" }),
    };
  }
};
