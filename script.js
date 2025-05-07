let apiKey = sessionStorage.getItem("apiKey");

if (!apiKey) {
  apiKey = prompt("Enter your API-Tennis key:");
  sessionStorage.setItem("apiKey", apiKey);
}

const searchBtn = document.getElementById("searchBtn");
const playerSearch = document.getElementById("playerSearch");

searchBtn.addEventListener("click", () => {
  const playerName = playerSearch.value.trim();
  if (playerName !== "") {
    fetchPlayerInfo(playerName);
  }
});

function fetchPlayerInfo(name) {
  const url = `https://api.api-tennis.com/tennis/?method=get_players&name=${encodeURIComponent(name)}&APIkey=${apiKey}`;
  console.log("🔍 Fetching player from:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("📦 Player API response:", data);

      if (data.error === "1" || !data.result || data.result.length === 0) {
        alert("Player not found or API error. Try a different name.");
        return;
      }

      const player = data.result[0];
      console.log("👤 Player object:", player);

      const fullName = `${player.firstname || ""} ${player.lastname || ""}`.trim();
      const country = player.country || "N/A";
      const rank = player.ranking || player.rank || "N/A";
      const points = player.points || "N/A";
      const playerId = player.player_id; // ✅ correct key

      document.getElementById("playerName").text

