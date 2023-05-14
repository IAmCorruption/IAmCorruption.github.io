(async () => {
  const config = await (await fetch("/config.json")).json();

  const allRequests = new Array();
  for (const sid of config.servers) {
    const stop = new Date();
    const start = new Date(stop.getTime() - 30 * 60 * 1000);
    allRequests.push([
      fetch(`https://api.battlemetrics.com/servers/${sid}?include=player`),
      fetch(
        `https://api.battlemetrics.com/servers/${sid}/relationships/sessions?start=${start.toISOString()}&stop=${stop.toISOString()}`
      ),
    ]);
  }

  const players = new Array();
  for (const requestGroup of allRequests) {
    const [current, recent] = await Promise.all(requestGroup);

    for (const {
      attributes: { name },
      attributes: { id: pid },
    } of (await current.json()).included) {
      const found = players.findIndex((e) => e.pid === pid);
      if (found < 0) {
        players.push({
          name,
          pid: pid,
          online: true,
        });

        continue;
      }

      players[found].online = true;
    }

    for (const {
      attributes: { name },
      relationships: {
        player: {
          data: { id: pid },
        },
      },
    } of (await recent.json()).data) {
      if (players.find((e) => e.pid === pid)) continue;

      players.push({
        name,
        pid: pid,
        online: false,
      });
    }
  }

  const list = document.getElementById("players");
  for (const player of players.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    })
  )) {
    if (
      config.hidden.includes(
        new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
          .update(player.pid)
          .getHash("HEX")
      )
    )
      continue;

    const anchor = document.createElement("a");
    anchor.href = `/player.html?pid=${player.pid}`;
    anchor.appendChild(document.createTextNode(player.name));

    if (!player.online) anchor.classList.add("offline");

    const listItem = document.createElement("li");
    listItem.appendChild(anchor);
    list.appendChild(listItem);
  }

  document.getElementById("loading").style.display = "none";
})();
