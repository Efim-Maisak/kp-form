import { getDativeCase } from "./getDativeCase";
import { getRespectfullTitle } from "./getRespectfullTitle";

export const prepareLeaderData = (selectedLeader, leaders) => {
    const selectedLeaderArr = leaders.filter( item => item.id === selectedLeader.value)
    let leader = selectedLeaderArr[0];
    leader = {
        customesBossFullName: leader.leaderFullName,
        customerPosition: leader.leaderPosition,
        customerBossShortName: getDativeCase(leader.leaderShortName),
        customerBossName: leader.leaderFullName.split(" ").slice(-2).join(" "),
        appeal: getRespectfullTitle(leader.leaderFullName.split(" ")[2])
    }
    return leader;
};