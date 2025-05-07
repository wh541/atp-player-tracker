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
  // Use the search endpoint to find player ID
  fetch(`https://api.api-tennis.com/tennis/?method=get_players&name=${encodeURIComponent(name)}&APIkey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const player = data.players[0];
      if (player) {
        document.getElementById("playerName").textContent = `${player.firstname} ${player.lastname}`;
        document.getElementById("playerCountry").textContent = player.country;
        document.getElementById("playerRank").textContent = player.rank;
        document.getElementById("playerPoints").textContent = player.points;
        document.getElementById("player-info").classList.remove("hidden");

        fetchRecentMatches(player.player_key);
      } else {
        alert("Player not found.");
      }
    })
    .catch(error => {
      console.error("Error fetching player:", error);
      alert("Something went wrong.");
    });
}

function fetchRecentMatches(playerKey) {
  fetch(`https://api.api-tennis.com/tennis/?method=get_results&player_key=${playerKey}&APIkey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const matchList = document.getElementById("matchList");
      matchList.innerHTML = "";
      if (data.result) {
        data.result.slice(0, 5).forEach(match => {
          const li = document.createElement("li");
          li.textContent = `${match.event} - ${match.event_date} - ${match.score}`;
          matchList.appendChild(li);
        });
        document.getElementById("matches").classList.remove("hidden");
      } else {
        matchList.innerHTML = "<li>No recent matches found.</li>";
      }
    })
    .catch(error => {
      console.error("Error fetching matches:", error);
    });
}
