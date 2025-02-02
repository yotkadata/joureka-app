import React, {useState, useEffect} from "react";
import { ParentSize } from "@visx/responsive";
import CustomWordcloud from "./Wordcloud";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { chartsDataService } from "../../../services/chartsData.service";
import { useRouter } from "next/router";

const WORDCLOUD_THRESHOLD = 50;

const WordcloudCard = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [selectedWord, setSelectedWord] = useState({});
  const [words, setWords] = useState(null)

  useEffect(() => {
    chartsDataService.getWordcloudWords(pid,WORDCLOUD_THRESHOLD).then((w) => {
      setWords(w.words);
    })
  }, []);

  return (
    <div className="custom-card full-width">
        <div className="custom-card-header">
            <div className="custom-card-title">
              <span>Wortwolke nach Häufigkeit</span>
              <div className={`d-inline-block custom-tooltip`}><button className="icon-button-transparent icon-orange mx-2">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
                {<span className="tooltiptext">Diese Wortwolke zeigt Dir die 50 häufigsten Begriffe in diesem Projekt. 
                Die dargestellte Größe des Wortes ist dabei proportional zu der Häufigkeit des Wortes. 
                Klicke auf ein Wort, um eine Liste der Aufnahmen zu sehen, in denen dieses vorkommt.</span>}
              </div>
            </div>
        </div>
        <div className="custom-card-body d-flex flex-column justify-content-center align-items-center">
            {!words && <LoadingSpinner text={"Grafik wird erstellt."}/>}
            {words && <ParentSize>{({ width, height }) => <CustomWordcloud width={width} height={height} words={words} setRecordingsList={setSelectedWord} showControls={false}/>}</ParentSize>}
        </div>
        {selectedWord.documents && <div>
          <div className="pb-3 d-flex justify-content-between">
            <span>Wort <b>{selectedWord.text}</b> kommt in folgenden Aufnahmen vor</span>
            <button onClick={() => setSelectedWord({})} className="icon-button-transparent icon-blue mx-2">
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
          <div className="chart-recordings-list">{
            selectedWord.documents.map((doc, index) => (
              <div key={index} className="p-1 d-flex justify-content-between">
                <span className="fw-bolder">{doc.title}</span>
                <button onClick={() => router.push(`/project/${pid}/recording/${doc.id}`)} className="custom-button custom-button-sm custom-button-blue">Zur Aufnahme</button>
              </div>
            ))
          }</div>
        </div> }
        <style jsx>{`
            .custom-card-body {
              height: 350px;
            }
        `}</style>
    </div>
  )
};

export default WordcloudCard;
