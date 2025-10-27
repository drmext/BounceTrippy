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
  BASIC = "Basic",
  DIFFICULT = "Difficult",
  EXPERT = "Expert",
  CHALLENGE = "Challenge";

const difficultyColors = {
  [BEGINNER]: "46, 219, 255",
  [BASIC]: "255, 174, 0",
  [DIFFICULT]: "255, 56, 79",
  [EXPERT]: "58, 236, 40",
  [CHALLENGE]: "241, 84, 166",
};

const spdpColors = {
  [SINGLE]: "50, 242, 255",
  [DOUBLE]: "255, 175, 0",
};

const difficultyMap = {
  0: {
    abbr: "BSP",
    type: SINGLE,
    difficulty: BEGINNER,
    rgb: difficultyColors[BEGINNER],
  },
  1: {
    abbr: "BSP",
    type: SINGLE,
    difficulty: BASIC,
    rgb: difficultyColors[BASIC],
  },
  2: {
    abbr: "DSP",
    type: SINGLE,
    difficulty: DIFFICULT,
    rgb: difficultyColors[DIFFICULT],
  },
  3: {
    abbr: "ESP",
    type: SINGLE,
    difficulty: EXPERT,
    rgb: difficultyColors[EXPERT],
  },
  4: {
    abbr: "CSP",
    type: SINGLE,
    difficulty: CHALLENGE,
    rgb: difficultyColors[CHALLENGE],
  },
  5: {
    abbr: "BDP",
    type: DOUBLE,
    difficulty: BASIC,
    rgb: difficultyColors[BASIC],
  },
  6: {
    abbr: "DDP",
    type: DOUBLE,
    difficulty: DIFFICULT,
    rgb: difficultyColors[DIFFICULT],
  },
  7: {
    abbr: "EDP",
    type: DOUBLE,
    difficulty: EXPERT,
    rgb: difficultyColors[EXPERT],
  },
  8: {
    abbr: "CDP",
    type: DOUBLE,
    difficulty: CHALLENGE,
    rgb: difficultyColors[CHALLENGE],
  },
};

const lampMap = {
  1: { abbr: "FAIL", text: "Fail", rgb: "186, 186, 186" },
  2: { abbr: "?", text: "2", rgb: "186, 186, 186" },
  3: { abbr: "CLEAR", text: "Clear", rgb: "186, 186, 186" },
  4: { abbr: "?", text: "4", rgb: "186, 186, 186" },
  5: { abbr: "LIFE8", text: "Life 8 Clear", rgb: "186, 186, 186" },
  6: { abbr: "LIFE4", text: "Life 4 Clear", rgb: "186, 186, 186" },
  7: { abbr: "FC", text: "Good Full Combo", rgb: "0, 192, 255" },
  8: { abbr: "FC", text: "Great Full Combo", rgb: "0, 255, 42" },
  9: { abbr: "PFC", text: "Perfect Full Combo", rgb: "246, 253, 105" },
  10: { abbr: "MFC", text: "Marvelous Full Combo", rgb: "254, 254, 204" },
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

const formatDifficulty = (DDR_MDB, mcode, difficulty) => {
  const difficultyChar = difficultyMap[difficulty].abbr.slice(0, 1);
  const spdpChar = difficultyMap[difficulty].abbr.slice(1);
  const tooltipString = `${difficultyMap[difficulty].difficulty} ${difficultyMap[difficulty].type}`;
  return (
    <>
      <Tooltip
        hasArrow
        label={tooltipString}
        aria-label={tooltipString}
        placement="top-end"
      >
        <Flex display="inline-flex">
          <Text
            display="inline"
            border={`0px solid rgb(${difficultyMap[difficulty].rgb})`}
          >
            {difficultyChar}
          </Text>
          <Text
            display="inline"
            border={`0px solid rgb(${spdpColors[difficultyMap[difficulty].type]
              })`}
          >
            {spdpChar}
          </Text>
        </Flex>
      </Tooltip>
      {` `}
      {DDR_MDB?.[mcode]?.diffLv?.[difficulty] || "??"}
    </>
  );
};

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

const GfdmScoresSection = ({ selectedDdrProfileId, getScoresQuery, DDR_MDB }) => (
  <>
    <Heading size="md" textAlign="left" mb="0.5rem">
      Scores
    </Heading>
    <Box>
      {!selectedDdrProfileId || getScoresQuery?.isError ? (
        <Text>coming soon</Text>
      ) : getScoresQuery?.isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Song</Th>
                <Th>Chart</Th>
                <Th>Rank / Lamp</Th>
                <Th textAlign="right">Score</Th>
                <Th textAlign="right">Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortScoresByTimestampDesc(getScoresQuery?.data?.data)?.map(
                ({
                  mcode,
                  difficulty,
                  score,
                  exscore,
                  lamp,
                  timestamp,
                  rank,
                }) => (
                  <Tr _hover={{ backgroundColor: '#EEE'}} key={`gfdm-score-${mcode}`}>
                    <Td maxW="14rem">
                      <Tooltip
                        hasArrow
                        label={DDR_MDB?.[mcode]?.artist || "MCODE"}
                        aria-label={DDR_MDB?.[mcode]?.artist || "MCODE"}
                        placement="top-start"
                      >
                        <Text
                          color="black"
                          background="none"
                          fontWeight="400"
                          maxW="14rem"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {DDR_MDB?.[mcode]?.title || mcode}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Badge color="black" background="none" fontWeight="400">
                        {formatDifficulty(DDR_MDB, mcode, difficulty)}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        color="black"
                        background="none"
                        border={`0px solid rgb(${rankMap[rank].rgb})`}
                        width="2.25rem"
                        textAlign="center"
                        fontWeight="400"
                      >
                        {rankMap[rank].text}
                      </Badge>

                      <Tooltip
                        hasArrow
                        label={
                          ![lampMap["3"].text, lampMap["1"].text].includes(
                            lampMap?.[lamp]?.text
                          ) && lampMap?.[lamp]?.text
                        }
                        aria-label={
                          ![lampMap["3"].text, lampMap["1"].text].includes(
                            lampMap?.[lamp]?.text
                          ) && lampMap?.[lamp]?.text
                        }
                        placement="top-end"
                      >
                        <Badge
                          color="black"
                          background="none"
                          width="4rem"
                          textAlign="center"
                          fontWeight="400"
                          border={`0px solid rgb(${lampMap?.[lamp]?.rgb})`}
                        >
                          {lampMap?.[lamp]?.abbr}
                        </Badge>
                      </Tooltip>
                    </Td>
                    <Td textAlign="right">
                      <Tooltip
                        hasArrow
                        label={`${exscore} EX`}
                        aria-label={`${exscore} EX`}
                        placement="top-end"
                      >
                        <Badge color="black" background="none" fontWeight="400">
                          {score.toLocaleString("en-US")}
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
              )}
            </Tbody>

          </Table>
        </TableContainer>
      )}
    </Box>
  </>
);

export default GfdmScoresSection;
