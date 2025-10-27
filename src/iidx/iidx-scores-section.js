
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Text,
  Badge,
  Tooltip,
  Flex,
  Box,
} from "@chakra-ui/react";
import { DateTime, Interval } from "luxon";

const SINGLE = "Single",
  DOUBLE = "Double",
  BEGINNER = "Beginner",
  NORMAL = "Normal",
  HYPER = "Hyper",
  ANOTHER = "Another",
  LEGGENDARIA = "Leggendaria";

const difficultyColors = {
  [BEGINNER]: "46, 219, 255",
  [NORMAL]: "255, 174, 0",
  [HYPER]: "255, 56, 79",
  [ANOTHER]: "58, 236, 40",
  [LEGGENDARIA]: "241, 84, 166",
};

const spdpColors = {
  [SINGLE]: "50, 242, 255",
  [DOUBLE]: "255, 175, 0",
};

const difficultyMap = {
  0: {
    abbr: "SPB_level",
    type: SINGLE,
    difficulty: BEGINNER,
    rgb: difficultyColors[BEGINNER],
  },
  1: {
    abbr: "SPN_level",
    type: SINGLE,
    difficulty: NORMAL,
    rgb: difficultyColors[NORMAL],
  },
  2: {
    abbr: "SPH_level",
    type: SINGLE,
    difficulty: HYPER,
    rgb: difficultyColors[HYPER],
  },
  3: {
    abbr: "SPA_level",
    type: SINGLE,
    difficulty: ANOTHER,
    rgb: difficultyColors[ANOTHER],
  },
  4: {
    abbr: "SPL_level",
    type: SINGLE,
    difficulty: LEGGENDARIA,
    rgb: difficultyColors[LEGGENDARIA],
  },
  5: {
    abbr: "DPB_level",
    type: DOUBLE,
    difficulty: BEGINNER,
    rgb: difficultyColors[BEGINNER],
  },
  6: {
    abbr: "DPN_level",
    type: DOUBLE,
    difficulty: NORMAL,
    rgb: difficultyColors[NORMAL],
  },
  7: {
    abbr: "DPH_level",
    type: DOUBLE,
    difficulty: HYPER,
    rgb: difficultyColors[HYPER],
  },
  8: {
    abbr: "DPA_level",
    type: DOUBLE,
    difficulty: ANOTHER,
    rgb: difficultyColors[ANOTHER],
  },
  9: {
    abbr: "DPL_level",
    type: DOUBLE,
    difficulty: LEGGENDARIA,
    rgb: difficultyColors[LEGGENDARIA],
  },
};

const lampMap = {
  0: { abbr: "NP", text: "No Play", rgb: "186, 186, 186" },
  1: { abbr: "FAIL", text: "Fail", rgb: "186, 186, 186" },
  2: { abbr: "AC", text: "Assist Clear", rgb: "186, 186, 186" },
  3: { abbr: "EC", text: "Easy Clear", rgb: "186, 186, 186" },
  4: { abbr: "CLEAR", text: "Clear", rgb: "186, 186, 186" },
  5: { abbr: "HC", text: "Hard Clear", rgb: "186, 186, 186" },
  6: { abbr: "EXHC", text: "EX Hard Clear", rgb: "186, 186, 186" },
  7: { abbr: "FC", text: "Full Combo", rgb: "0, 192, 255" },
};

const rankMap = {
  0: { text: "AAA", rgb: "247, 239, 145" },
  1: { text: "AA+", rgb: "255, 230, 14" },
  2: { text: "AA", rgb: "255, 230, 14" },
  3: { text: "AA-", rgb: "255, 230, 14" },
  4: { text: "A+", rgb: "255, 230, 14" },
  5: { text: "A", rgb: "255, 230, 14" },
  6: { text: "A-", rgb: "255, 230, 14" },
  7: { text: "B+", rgb: "41, 137, 255" },
  8: { text: "B", rgb: "41, 137, 255" },
  9: { text: "B-", rgb: "41, 137, 255" },
  10: { text: "C+", rgb: "255, 115, 255" },
  11: { text: "C", rgb: "255, 115, 255" },
  12: { text: "C-", rgb: "255, 115, 255" },
  13: { text: "D+", rgb: "255, 59, 14" },
  14: { text: "D", rgb: "255, 59, 14" },
  15: { text: "E", rgb: "186, 186, 186" },
};

// const formatDifficulty = (DDR_MDB, music_id, play_style, chart_id) => {
//   return (
//     <>
//       <Tooltip
//         hasArrow
//         label={tooltipString}
//         aria-label={tooltipString}
//         placement="top-end"
//       >
//         {/* <Flex display="inline-flex">
//           <Text
//             display="inline"
//             border={`0px solid rgb(${difficultyMap[difficulty].rgb})`}
//           >
//             {difficultyChar}
//           </Text>
//           <Text
//             display="inline"
//             border={`0px solid rgb(${spdpColors[difficultyMap[difficulty].type]
//               })`}
//           >
//             {spdpChar}
//           </Text>
//         </Flex> */}
//       </Tooltip>
//       {` `}
//       {/* {DDR_MDB?.[mcode]?.diffLv?.[difficulty] || "??"} */}
//       {DDR_MDB?.[music_id]?.SPA_level || "??"}
//     </>
//   );
// };

const formatTimestamp = (timestamp) => {
  const isoDate = new Date(timestamp * 1000);
  // YYYY-MM-DD: isoDate.toISOString().split("T")[0]
  return `${isoDate.toLocaleDateString()} ${isoDate.toLocaleTimeString()}`;
};

const getTimeSincePlayed = (timestamp) => {
  const timestampDateTime = DateTime.fromSeconds(timestamp);
  const nowDateTime = DateTime.now();

  const interval = Interval.fromDateTimes(
    timestampDateTime,
    nowDateTime
  ).toDuration(["days", "hours", "minutes"]).values;
  // YYYY-MM-DD: isoDate.toISOString().split("T")[0]
  const daysString = interval.days
    ? `${interval.days} ${interval.days > 1 ? "days" : "day"}, `
    : "";
  const hoursString = interval.hours
    ? `${interval.hours} ${interval.hours > 1 ? "hours" : "hour"}, `
    : "";
  const minutesString = interval.minutes
    ? `${parseInt(interval.minutes)}  ${parseInt(interval.minutes) === 1 ? "minute" : "minutes"}`
    : "";

  return `${daysString}${hoursString}${minutesString} ago`;
};

const sortScoresByTimestampDesc = (scores) =>
  JSON.parse(JSON.stringify(scores)).reverse();

const getGradeFromScore = (notecounts, music_id, chartType, score) => {
  const grades = [
    "F",
    "F",
    "E",
    "D",
    "C",
    "B",
    "A",
    "AA",
    "AAA",
    "MAX",
  ];

  const topscore = notecounts?.[music_id.toString().padStart(5, "0")]?.[chartType] * 2
  const percent = score / topscore;
  const grade = parseInt(9.0 * percent);
  return grades[grade]

}

const IidxScoresSection = ({ selectedProfileId, getScoresQuery, DDR_MDB, notecounts }) => (

  <>
    <Heading size="md" textAlign="left" mb="0.5rem">
      Scores
    </Heading>
    <Box>
      {!selectedProfileId || getScoresQuery?.isError ? (
        <Text>No Scores</Text>
      ) : getScoresQuery?.isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <TableContainer
        // Dark Mode
        // background="#444" color="#ddd"
        >
          <Table variant="simple">
            {/* <TableCaption>DDR Scores</TableCaption> */}
            <Thead>
              <Tr>
                <Th>Song</Th>
                <Th textAlign="right">Chart</Th>
                <Th>Rank / Lamp</Th>
                <Th textAlign="right">Score</Th>
                <Th textAlign="right">Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortScoresByTimestampDesc(getScoresQuery?.data?.data)?.map(
                ({
                  music_id,
                  play_style,
                  chart_id,
                  ex_score,
                  clear_flg,
                  timestamp,
                }) => {
                  const chartType = difficultyMap[play_style === 0 ? chart_id : chart_id + 5].abbr.slice(0, 3)
                  return (
                    <Tr _hover={{ backgroundColor: '#EEE' }} key={`iidx-score-${music_id}-${timestamp}`}>
                      <Td maxW="17rem">
                        <Tooltip
                          hasArrow
                          label={DDR_MDB?.[music_id]?.artist || "MCODE"}
                          aria-label={DDR_MDB?.[music_id]?.artist || "MCODE"}
                          placement="top-start"
                        >
                          <Text
                            color="black"
                            background="none"
                            fontWeight="400"
                            maxW="17rem"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {DDR_MDB?.[music_id]?.title || music_id}
                          </Text>
                        </Tooltip>
                      </Td>
                      {/* <Td>
                      <Badge color="black" background="none" fontWeight="400">
                        {formatDifficulty(DDR_MDB, music_id, play_style, chart_id)}
                      </Badge>
                    </Td> */}
                      <Td textAlign="center">
                        <Tooltip
                          hasArrow
                          placement="top-end"
                        >
                          <Badge color="black" background="none" fontWeight="400" textAlign="center">
                            {chartType}<span> </span>
                            {DDR_MDB?.[music_id]?.[difficultyMap[play_style === 0 ? chart_id : chart_id + 5].abbr] || "??"}
                          </Badge>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Flex justify='center'>
                          {/* <Badge
                        color="black"
                          background="none"
                          // border={`0px solid rgb(${rankMap[rank].rgb})`}
                          width="2.25rem"
                          textAlign="center"
                          fontWeight="400"
                        >
                          {rankMap[rank].text}
                        </Badge> */}
                          <Text>
                            {getGradeFromScore(notecounts, music_id, chartType, ex_score) || '??'} /
                          </Text>
                          <Tooltip
                            hasArrow
                            label={lampMap?.[clear_flg]?.text}
                            aria-label={lampMap?.[clear_flg]?.text}
                            placement="top-end"
                          >
                            <Badge
                              color="black"
                              background="none"
                              width="2.25rem"
                              textAlign="center"
                              fontWeight="400"
                              border={`0px solid rgb(${lampMap?.[clear_flg]?.rgb})`}
                            >
                              {lampMap?.[clear_flg]?.abbr}
                            </Badge>
                          </Tooltip>
                        </Flex>
                      </Td>
                      <Td textAlign="right">
                        <Tooltip
                        // hasArrow
                        // label={`${ex_score} EX`}
                        // aria-label={`${ex_score} EX`}
                        // placement="top-end"
                        >
                          <Badge color="black" background="none" fontWeight="400">
                            {/* {score.toLocaleString("en-US")} */}
                            {`${ex_score} EX`}
                          </Badge>
                        </Tooltip>
                      </Td>
                      <Td textAlign="right">
                        <Tooltip
                          hasArrow
                          label={getTimeSincePlayed(timestamp)}
                          aria-label={getTimeSincePlayed(timestamp)}
                          placement="top-end"
                        >
                          <Badge color="black" background="none" fontWeight="400">
                            {formatTimestamp(timestamp)}
                          </Badge>
                        </Tooltip>
                      </Td>
                    </Tr>
                  )
                }
              )}
            </Tbody>
            {/* <Tfoot>Pagination</Tfoot> */}
          </Table>
        </TableContainer>
      )}
    </Box>
  </>
);

export default IidxScoresSection;
