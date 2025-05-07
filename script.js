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

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("Player API response:", data);

      if (!data.players || data.players.length === 0) {
        alert("Player not found. Try using full name (e.g., Rafael Nadal).");
        return;
      }

      const player = data.players[0];

      document.getElementById("playerName").textContent = `${player.firstname} ${player.lastname}`;
      document.getElementById("playerCountry").textContent = player.country;
      document.getElementById("playerRank").textContent = player.rank;
      document.getElementById("playerPoints").textContent = player.points;
      document.getElementById("player-info").classList.remove("hidden");

      fetchRecentMatches(player.player_key);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      alert("Something went wrong. Check the console.");
    });
}

function fetchRecentMatches(playerKey) {
  const url = `https://api.api-tennis.com/tennis/?method=get_results&player_key=${playerKey}&APIkey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data

