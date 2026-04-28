exports.handler = async function () {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const broadcasterId = process.env.TWITCH_BROADCASTER_ID;

  try {
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

    const streamRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${broadcasterId}`,
      {
        headers: {
          "Client-Id": clientId,
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const streamData = await streamRes.json();
    const stream = streamData.data?.[0];

    if (!stream) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          isLive: false,
          title: "現在はオフラインです",
          game: "OFFLINE",
          viewerCount: 0,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewerCount: stream.viewer_count,
        startedAt: stream.started_at,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch Twitch status",
      }),
    };
  }
};