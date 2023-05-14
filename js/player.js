(async () => {
  const params = new URLSearchParams(document.location.search);
  const pid = params.get("pid");

  if (!pid) return;

  document.getElementById("logs").href = `/logs.html?pid=${pid}`;

  const hidden = (await (await fetch("/config.json")).json()).hidden;

  if (
    hidden.includes(
      new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
        .update(pid)
        .getHash("HEX")
    )
  ) {
    location.href = "https://youtu.be/dQw4w9WgXcQ";
    return;
  }

  const list = document.getElementById("names");

  for (const {
    attributes: { identifier },
  } of (
    await (
      await fetch(
        `https://api.battlemetrics.com/players/${pid}?include=identifier`
      )
    ).json()
  ).included) {
    const listItem = document.createElement("li");
    listItem.appendChild(document.createTextNode(identifier));
    list.appendChild(listItem);
  }

  document.getElementById("loading").style.display = "none";
})();
