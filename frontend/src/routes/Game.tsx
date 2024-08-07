import { useLoaderData, useParams } from "react-router-dom";
import axiosConfig from "../api/axiosConfig";
import { padZero } from "../common/helper";
import AnimeInfo, {
  AnimeHidden,
  RatingHidden,
  TitleHidden,
} from "../components/Game/AnimeInfo";
import { useEffect, useState } from "react";
import AnswerInfo from "../components/Game/AnswerInfo";
import AnimeMode from "../components/Game/AnimeMode";
import RatingMode from "../components/Game/RatingMode";

type UrlParams = {
  date: string;
  mode: string;
};

export type AnimeAnswer = {
  malId: string;
  realVotes: number;
  aiVotes: number;
  name: string;
  imgUrl: String;
  fake: boolean;
};

export type RatingAnswer = {
  malId: string;
  score: number;
  name: string;
  imgUrl: string;
  scores: number[];
};

export default function Game() {
  const anime = useLoaderData() as AnimeHidden | RatingHidden | TitleHidden;
  const { mode, date } = useParams();
  const [answer, setAnswer] = useState<AnimeAnswer | RatingAnswer>();

  useEffect(() => {
    setAnswer(undefined);
  }, [mode, date]);

  return (
    <div className="border-4 border-pink-900">
      {answer === undefined ? (
        <div>
          <AnimeInfo anime={anime} />
          {(mode === undefined || mode === "anime" || mode === "title") && (
            <AnimeMode setAnswer={setAnswer} />
          )}
          {mode === "rating" && <RatingMode setAnswer={setAnswer} />}
        </div>
      ) : (
        <div>
          <AnswerInfo answer={answer} />
        </div>
      )}
    </div>
  );
}

export async function todayLoader() {
  const today = new Date();
  const anime = await axiosConfig.get(
    `/anime/${today.getUTCFullYear()}-${padZero(
      today.getUTCMonth() + 1
    )}-${padZero(today.getUTCDate())}`
  );
  return anime.data;
}

export async function dateLoader({ params }: { params: any }) {
  const { date, mode } = params as UrlParams;
  const anime = await axiosConfig.get(`/${mode}/${date}`);
  return anime.data;
}
