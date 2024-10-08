import { useLoaderData, useParams } from "react-router-dom";
import axiosConfig from "../api/axiosConfig";
import { getTodayDate, nextDay, parseDate, prevDay } from "../common/helper";
import {
  AnimeHidden,
  RatingHidden,
  TitleHidden,
} from "../components/Game/AnimeStats";
import { useEffect, useState } from "react";
import AnswerInfo from "../components/Game/AnswerInfo";
import AnimeMode, { History } from "../components/Game/AnimeMode";
import RatingMode from "../components/Game/RatingMode";
import { useHistoryState } from "../store/store";
import HomeButton from "../components/Home/HomeButton";
import AnimeStats from "../components/Game/AnimeStats";
import AnimeInfo from "../components/Game/AnimeInfo";
import AnswerPic from "../components/Game/AnswerPic";
import { Link } from "react-router-dom";
import Loading from "../components/Home/Loading";
import ChevronLeft from "../components/Icons/ChevronLeft";
import ChevronRight from "../components/Icons/ChevronRight";
import { ANIME_SUBMIT, MANGA_SUBMIT, START_DATE } from "../common/constants";
import CustomBorder from "../components/Home/CustomBorder";

type UrlParams = {
  date: string;
  mode: string;
};

export type AnimeAnswer = AnimeVotes &
  Answer & {
    fake: boolean;
    guess: boolean;
  };

export type RatingAnswer = RatingVotes &
  Answer & {
    guess: number;
  };

export type Answer = {
  malId: string;
  name: string;
  imgUrl: string;
  guess: boolean | number;
};

export type AnimeVotes = {
  realVotes: number;
  aiVotes: number;
};

export type RatingVotes = {
  score: number;
  scores: number[];
};

export default function Game() {
  const { anime, votes } = useLoaderData() as {
    anime: AnimeHidden | RatingHidden | TitleHidden;
    votes: AnimeVotes | RatingVotes | undefined;
  };

  const { mode, date } = useParams();
  const [answer, setAnswer] = useState<AnimeAnswer | RatingAnswer>();
  const [history, setHistory] = useHistoryState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const m = mode ? mode : "anime";
    const d = date ? date : getTodayDate();

    const guess = (JSON.parse(history) as History)[m as keyof History][d];
    if (guess && votes) {
      if ((m === "anime" || m === "title") && "realVotes" in votes) {
        // Get guess stats
        setAnswer({
          malId: guess.malId,
          realVotes: votes.realVotes,
          aiVotes: votes.aiVotes,
          name: guess.name,
          imgUrl: guess.imgUrl,
          fake: guess.answer as boolean,
          guess: guess.guess as boolean,
        });
      } else if (m === "rating" && "scores" in votes) {
        setAnswer({
          malId: guess.malId,
          score: guess.answer as number,
          name: guess.name,
          imgUrl: guess.imgUrl,
          scores: votes.scores,
          guess: guess.guess as number,
        });
      }
    } else {
      setAnswer(undefined);
    }
  }, [mode, date]);

  return (
    <>
      {!loading ? (
        <>
          <AnimeStats anime={anime} />
          <div className="grow flex flex-col">
            <div className="grow justify-center items-center flex flex-col p-4 sm:px-8 gap-4">
              {answer !== undefined &&
                (!("fake" in answer) || !answer.fake) && (
                  <AnswerPic imgUrl={answer.imgUrl} malId={answer.malId} />
                )}
              <AnimeInfo genres={anime.genres}>
                {"oneLiner" in anime ? (
                  <>
                    {answer && (
                      <h2 className="text-xl font-bold mb-4">{answer.name}</h2>
                    )}
                    <h2 className="uppercase font-bold text-balance">
                      {anime.oneLiner}
                    </h2>
                    <hr className="w-1/2 mt-2 mx-auto border-2 rounded-full border-pink-900 dark:border-dark-pink-900" />
                    <h5 className="text-pretty my-2">{anime.summary}</h5>
                  </>
                ) : (
                  <h2 className="text-xl font-bold text-balance">
                    {anime.title}
                  </h2>
                )}
              </AnimeInfo>
            </div>
            <div className="p-4 pt-0">
              <div className="grow">
                {answer === undefined ? (
                  <>
                    <p className="text-[10px] pb-4">
                      This site is protected by reCAPTCHA and the Google{" "}
                      <a href="https://policies.google.com/privacy">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="https://policies.google.com/terms">
                        Terms of Service
                      </a>{" "}
                      apply.
                    </p>
                    {(mode === undefined ||
                      mode === "anime" ||
                      mode === "title") && (
                      <AnimeMode
                        setAnswer={setAnswer}
                        anime={anime}
                        setLoading={setLoading}
                      />
                    )}
                    {mode === "rating" && (
                      <RatingMode
                        setAnswer={setAnswer}
                        anime={anime as RatingHidden}
                        setLoading={setLoading}
                      />
                    )}
                  </>
                ) : (
                  <div className="gap-4 flex flex-col">
                    <AnswerInfo answer={answer} anime={anime} />

                    <CustomBorder>
                      <div className="flex">
                        <Link
                          to={`/ainime/${mode ? mode : "anime"}/${prevDay(
                            date ? new Date(date) : new Date()
                          )}`}
                        >
                          <HomeButton
                            disabled={
                              date
                                ? prevDay(new Date(date)) <
                                  parseDate(START_DATE)
                                : date !== undefined
                            }
                          >
                            <ChevronLeft />
                          </HomeButton>
                        </Link>
                        <div className="grow border-x-4 border-pink-900 dark:border-dark-pink-900">
                          <Link
                            to={`/ainime/${mode ? mode : "anime"}/archive#${
                              date ? date : getTodayDate()
                            }`}
                          >
                            <HomeButton>Archive</HomeButton>
                          </Link>
                        </div>
                        <Link
                          to={`/ainime/${mode ? mode : "anime"}/${nextDay(
                            date ? new Date(date) : new Date()
                          )}`}
                        >
                          <HomeButton
                            disabled={
                              date
                                ? nextDay(new Date(date)) > getTodayDate()
                                : true
                            }
                          >
                            <ChevronRight />
                          </HomeButton>
                        </Link>
                      </div>
                    </CustomBorder>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export async function dateLoader({ params }: { params: any }) {
  const { date, mode } = params as UrlParams;
  const m = mode || "anime";
  const d = date || getTodayDate();
  let animeData;

  const history = localStorage.getItem("history");
  let h = history ? (JSON.parse(history) as History) : undefined;
  const guess = h ? h[m as keyof History][d] : undefined;
  let votes = null;
  if (guess) {
    // Fetch additional stats data if guess is defined
    votes = axiosConfig.get(`/${m}/stats/${d}`);
    animeData = {
      ...guess,
    };
  } else {
    const anime = axiosConfig.get(`/${m}/${d}`);
    animeData = (await anime).data;
  }
  votes = await votes;
  const votesData = votes ? votes.data : undefined;

  return { anime: animeData, votes: votesData };
}
