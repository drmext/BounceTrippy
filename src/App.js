/* eslint-disable no-unused-expressions */
import "./App.css";
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Text,
  Heading,
  VStack,
  Flex,

  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";

import DdrScoresSection from "./ddr/ddr-scores-section";
import DdrProfileSidebar from "./ddr/ddr-profile-sidebar";

import GfdmScoresSection from "./gfdm/gfdm-scores-section";
import GfdmProfileSidebar from "./gfdm/gfdm-profile-sidebar";

import IidxScoresSection from "./iidx/iidx-scores-section";
import IidxProfileSidebar from "./iidx/iidx-profile-sidebar";

import useGlobalData from "./global-data";

const DDR = 'DDR', GFDM = 'GFDM', IIDX = 'IIDX'
const games = [DDR, GFDM, IIDX]

function App() {

  const {
    getDdrProfilesQuery,
    getDdrScoresByProfileIdQuery,
    getGfdmProfilesQuery,
    getGfdmScoresByProfileIdQuery,
    getIidxProfilesQuery,
    getIidxScoresByProfileIdQuery,
    updateMainDDRSettingsMutation,
    updateMainGFDMSettingsMutation,
    onChangeStartupArc,
    saveAllDdr,
    saveAllGfdm,
    saveAllIidx,
    selectedDdrProfileId,
    setSelectedDdrProfileId,
    selectedGfdmProfileId,
    setSelectedGfdmProfileId,
    mainDDRSettings,
    setMainDDRSettings,
    mainGFDMSettings,
    setMainGFDMSettings,
    mainIIDXSettings,
    setMainIIDXSettings,
    selectedIidxProfileId,
    setSelectedIidxProfileId,
    ddrVersionKeys,
    selectedDdrVersionKey,
    setSelectedDdrVersionKey,
    ddrVersionSettings,
    setDdrVersionSettings,
    gfdmVersionKeys,
    selectedGfdmVersionKey,
    setSelectedGfdmVersionKey,
    gfdmVersionSettings,
    setGfdmVersionSettings,
    selectedGame,
    setSelectedGame,
    ddrJson,
    gfdmJson,
    iidxJson,
    updateMainIIDXSettingsMutation,
    iidxVersionKeys,
    iidxVersionSettings,
    setIidxVersionSettings,
    selectedIidxVersionKey,
    setSelectedIidxVersionKey,
    iidxNotecountsJson
  } = useGlobalData()


  const setSelectedDdrProfileIdHandler = (value) => setSelectedDdrProfileId(value);
  const setNewDdrCardHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, card: newValue }))
  const setNewDdrTimingDispHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, timing_disp: newValue }))
  const setNewDdrPinHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, pin: newValue }))

  const setSelectedGfdmProfileIdHandler = (value) => setSelectedGfdmProfileId(value);
  const setNewGfdmCardHandler = (newValue) => setMainGFDMSettings((prev) => ({ ...prev, card: newValue }))
  const setNewGfdmPinHandler = (newValue) => setMainGFDMSettings((prev) => ({ ...prev, pin: newValue }))

  const setSelectedIidxProfileIdHandler = (value) => setSelectedIidxProfileId(value);
  const setNewIidxCardHandler = (newValue) => setMainIIDXSettings((prev) => ({ ...prev, card: newValue }))
  const setNewIidxTimingDispHandler = (newValue) => setMainIIDXSettings((prev) => ({ ...prev, timing_disp: newValue }))
  const setNewIidxPinHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, pin: newValue }))

  const onSelectGameHandler = gameIndex => setSelectedGame(games[gameIndex])
  const onChangeStartupArcHandler = (e) => onChangeStartupArc(e.target.files[0], selectedGame)

  const [showSidebar, setShowSidebar] = useState(true)
  const maxWidth = "1020px";


  const fileUploadText = {
    [DDR]: 'select startup.arc to load metadata',
    [IIDX]: 'select music_data.bin to load metadata',
    [GFDM]: 'Coming Soon'
  }[selectedGame]

  const onClickMonkey = () => setShowSidebar(prev => !prev)

  return (
    <VStack
      maxW={maxWidth}
      backgroundColor="none"
      margin={"0 auto"}
      padding="1rem"
      align="left"
    >
      <Flex
        w={maxWidth}
        padding="0"
        backgroundColor="none"
        mb="1rem"
        justify="space-between"
        alignItems="center"
        borderBottom="1px solid #eee"
      >
        <Heading onClick={onClickMonkey} fontSize="4rem" mb="0.75rem" _hover={{ filter: 'saturate(200%)' }} transition={'filter 0.25s ease-in-out'} userSelect={'none'}>🐵</Heading>
        <Tabs onChange={onSelectGameHandler}>
          <TabList>
            {games.map(game => <Tab key={`game-${game}`}>{game}</Tab>)}
          </TabList>
        </Tabs>
        <Box width="14rem">
          <input
            type="file"
            placeholder="select startup.arc"
            onChange={onChangeStartupArcHandler}
            style={{ fontSize: "0.75rem" }}
            disabled={selectedGame === GFDM}
          />
          <Text fontSize="xs">{fileUploadText}</Text>
        </Box>
      </Flex>
      <Container maxW={maxWidth} padding="0">
        <Flex>
          <Box backgroundColor="none" w={"9.75rem"} display={showSidebar ? 'block' : 'none'} minH="100%" >
            {
              selectedGame === IIDX ? <IidxProfileSidebar
                saveAll={saveAllIidx}
                newPin={mainIIDXSettings?.pin}
                setNewPin={setNewIidxPinHandler}
                // newTimingDisp={verse}
                setNewTimingDisp={setNewIidxTimingDispHandler}
                profiles={getIidxProfilesQuery?.data?.data}
                newCard={mainIIDXSettings?.card}
                setNewCard={setNewIidxCardHandler}
                selectedProfileId={selectedIidxProfileId}
                setSelectedProfileId={setSelectedIidxProfileIdHandler}
                versionKeys={iidxVersionKeys}
                selectedVersionKey={selectedIidxVersionKey}
                setSelectedVersionKey={setSelectedIidxVersionKey}
                versionSettings={iidxVersionSettings}
                setVersionSettings={setIidxVersionSettings}
                savingInProgress={updateMainIIDXSettingsMutation.inProgress}
              /> : selectedGame === DDR ? <DdrProfileSidebar
                saveAllDdr={saveAllDdr}
                newPin={mainDDRSettings?.pin}
                setNewPin={setNewDdrPinHandler}
                // newTimingDisp={verse}
                setNewTimingDisp={setNewDdrTimingDispHandler}
                profiles={getDdrProfilesQuery?.data?.data}
                newCard={mainDDRSettings?.card}
                setNewCard={setNewDdrCardHandler}
                selectedDdrProfileId={selectedDdrProfileId}
                setSelectedDdrProfileIdHandler={setSelectedDdrProfileIdHandler}
                ddrVersionKeys={ddrVersionKeys}
                selectedDdrVersionKey={selectedDdrVersionKey}
                setSelectedDdrVersionKey={setSelectedDdrVersionKey}
                ddrVersionSettings={ddrVersionSettings}
                setDdrVersionSettings={setDdrVersionSettings}
                savingInProgress={updateMainDDRSettingsMutation.inProgress}
              /> : selectedGame === GFDM ? <GfdmProfileSidebar
                saveAllGfdm={saveAllGfdm}
                newPin={mainGFDMSettings?.pin}
                setNewPin={setNewGfdmPinHandler}
                // newTimingDisp={verse}
                // setNewTimingDisp={setNewGfdmTimingDispHandler}
                profiles={getGfdmProfilesQuery?.data?.data}
                newCard={mainGFDMSettings?.card}
                setNewCard={setNewGfdmCardHandler}
                selectedGfdmProfileId={selectedGfdmProfileId}
                setSelectedGfdmProfileIdHandler={setSelectedGfdmProfileIdHandler}
                gfdmVersionKeys={gfdmVersionKeys}
                selectedGfdmVersionKey={selectedGfdmVersionKey}
                setSelectedGfdmVersionKey={setSelectedGfdmVersionKey}
                gfdmVersionSettings={gfdmVersionSettings}
                setGfdmVersionSettings={setGfdmVersionSettings}
                savingInProgress={updateMainGFDMSettingsMutation.inProgress}
              /> :
                <></>
            }
          </Box>

          <Box backgroundColor="none" maxW="1200px" height="100%" ml="2rem">
            {
              selectedGame === IIDX
                ? <IidxScoresSection
                  selectedProfileId={selectedIidxProfileId}
                  getScoresQuery={getIidxScoresByProfileIdQuery}
                  notecounts={iidxNotecountsJson}
                  DDR_MDB={iidxJson?.data?.reduce((o, key) => ({ ...o, [key.song_id]: key }), {})}
                /> :
                selectedGame === DDR
                  ? <DdrScoresSection
                    selectedDdrProfileId={selectedDdrProfileId}
                    getScoresQuery={getDdrScoresByProfileIdQuery}
                    DDR_MDB={ddrJson}
                  /> :
                  selectedGame === GFDM
                    ? <GfdmScoresSection
                      selectedGfdmProfileId={selectedGfdmProfileId}
                      getScoresQuery={getGfdmScoresByProfileIdQuery}
                      DDR_MDB={gfdmJson}
                    /> :
                    <></>
            }
          </Box>
        </Flex>
      </Container>
    </VStack >
  );
}

export default App;
