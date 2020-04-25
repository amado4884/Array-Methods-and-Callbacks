import { fifaData } from "./fifa.js";
// console.log(fifaData);

// ⚽️ M  V P ⚽️ //

/* Task 1: Investigate the data above. Practice accessing data by console.log-ing the following pieces of data 

(a) Home Team name for 2014 world cup final
(b) Away Team name for 2014 world cup final
(c) Home Team goals for 2014 world cup final
(d) Away Team goals for 2014 world cup final
(e) Winner of 2014 world cup final */

/* Task 2: Create a function called  getFinals that takes `data` as an argument and returns an array of objects with only finals data */

function getFinals(data) {
  return data.filter((match) => match.Stage === "Final");
}

console.log(getFinals(fifaData));

/* Task 3: Impliment a higher-order function called `getYears` that accepts the callback function `getFinals`, and returns an array called `years` containing all of the years in the dataset */

function getYears(getFinals) {
  return getFinals(fifaData).map((match) => match.Year);
}

console.log(getYears(getFinals));

/* Task 5: Impliment a higher-order function called `getWinners`, that accepts the callback function `getFinals()` and determine the winner (home or away) of each `finals` game. Return the name of all winning countries in an array called `winners` */

function getWinners(getFinals) {
  const winners = [];
  getFinals(fifaData).forEach((match) => {
    if (match["Home Team Goals"] > match["Away Team Goals"])
      winners.push(match["Home Team Name"]);
    else if (match["Home Team Goals"] < match["Away Team Goals"])
      winners.push(match["Away Team Name"]);
    else winners.push(match["Win conditions"].split(" ")[0]);
  });
  return winners;
}

console.log(getWinners(getFinals));

/* Task 6: Implement a higher-order function called `getWinnersByYear` that accepts the following parameters and returns a set of strings "In {year}, {country} won the world cup!" 

Parameters: 
 * callback function getWinners
 * callback function getYears
 */

function getWinnersByYear(getWinners, getYears) {
  const winners = getWinners(getFinals);
  const years = getYears(getFinals);
  const response = [];
  for (let i = 0; i < winners.length; i++) {
    response.push(`In ${years[i]}, ${winners[i]} won the world cup!`);
  }
  return response;
}
console.log(getWinnersByYear(getWinners, getYears));

/* Task 7: Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data, teamInitials) {
  const winnersInitials = [];
  getFinals(data).forEach((match) => {
    if (match["Home Team Goals"] > match["Away Team Goals"])
      winnersInitials.push(match["Home Team Initials"]);
    else if (match["Home Team Goals"] < match["Away Team Goals"])
      winnersInitials.push(match["Away Team Initials"]);
    else {
      const winner = match["Win conditions"].split(" ")[0];
      const initials =
        match["Home Team Name"] === winner
          ? match["Home Team Initials"]
          : match["Away Team Initials"];
      winnersInitials.push(initials);
    }
  });
  console.log(winnersInitials);
  return winnersInitials.reduce((total, winnerInitial) => {
    return winnerInitial === teamInitials ? total + 1 : total;
  }, 0);
}

console.log(getCountryWins(fifaData, "BRA"));

/* Task 9: Write a function called `getAverageGoals` that accepts a parameter `data` and returns the the average number of home team goals 
// and away team goals scored per match (Hint: use .reduce and do this in 2 steps) */

function getAverageGoals(data) {
  const totalGoals = data.reduce((total, currentMatch) => {
    return (
      total + currentMatch["Away Team Goals"] + currentMatch["Home Team Goals"]
    );
  }, 0);
  return totalGoals / data.length;
}

console.log(getAverageGoals(fifaData));

/// STRETCH 🥅 //

/* STRETCH 1: Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */

function getGoals(data) {
  // {initalls: {team, total, count}}
  const teamsInFinals = {};

  const finals = data.filter((match) => match.Stage === "Final");
  finals.forEach((final) => {
    const home = final["Home Team Name"];
    const away = final["Away Team Name"];
    const homeGoals = final["Home Team Goals"];
    const awayGoals = final["Away Team Goals"];
    const homeInitials = final["Home Team Initials"];
    const awayInitials = final["Away Team Initials"];
    if (!(homeInitials in teamsInFinals)) {
      teamsInFinals[homeInitials] = { team: home, total: homeGoals, count: 1 };
    } else {
      teamsInFinals[homeInitials] = {
        team: teamsInFinals[homeInitials].team,
        total: teamsInFinals[homeInitials].total + homeGoals,
        count: teamsInFinals[homeInitials].count + 1,
      };
    }
    if (!(awayInitials in teamsInFinals)) {
      teamsInFinals[awayInitials] = { team: away, total: awayGoals, count: 1 };
    } else {
      teamsInFinals[awayInitials] = {
        team: teamsInFinals[awayInitials].team,
        total: teamsInFinals[awayInitials].total + awayGoals,
        count: teamsInFinals[awayInitials].count + 1,
      };
    }
  });
  const results = Object.values(teamsInFinals).map((team) => {
    return { name: team.team, avg: team.total / team.count };
  });
  let winner = results[0];
  results.forEach((team) => {
    if (team.avg > winner.avg) winner = team;
  });
  return winner;
}

console.log(getGoals(fifaData));

/* STRETCH 2: Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */

function badDefense(data) {
  // {initalls: {team, total, count}}
  const teamsInFinals = {};

  const finals = data.filter((match) => match.Stage === "Final");
  finals.forEach((final) => {
    const home = final["Home Team Name"];
    const away = final["Away Team Name"];
    const homeGoals = final["Home Team Goals"];
    const awayGoals = final["Away Team Goals"];
    const homeInitials = final["Home Team Initials"];
    const awayInitials = final["Away Team Initials"];
    if (!(homeInitials in teamsInFinals)) {
      teamsInFinals[homeInitials] = {
        team: home,
        scoredAgainst: awayGoals,
        count: 1,
      };
    } else {
      teamsInFinals[homeInitials] = {
        team: teamsInFinals[homeInitials].team,
        scoredAgainst: teamsInFinals[homeInitials].scoredAgainst + awayGoals,
        count: teamsInFinals[homeInitials].count + 1,
      };
    }
    if (!(awayInitials in teamsInFinals)) {
      teamsInFinals[awayInitials] = {
        team: away,
        scoredAgainst: homeGoals,
        count: 1,
      };
    } else {
      teamsInFinals[awayInitials] = {
        team: teamsInFinals[awayInitials].team,
        scoredAgainst: teamsInFinals[awayInitials].scoredAgainst + homeGoals,
        count: teamsInFinals[awayInitials].count + 1,
      };
    }
  });
  const results = Object.values(teamsInFinals).map((team) => {
    return { name: team.team, avg: team.scoredAgainst / team.count };
  });
  let loser = results[0];
  results.forEach((team) => {
    if (team.avg > loser.avg) loser = team;
  });
  return loser;
}

console.log(badDefense(fifaData));

/* If you still have time, use the space below to work on any stretch goals of your chosing as listed in the README file. */
