import { useLoaderData, useParams } from "react-router-dom";
import axiosConfig from "../api/axiosConfig";
import { padZero } from "../common/helper";
import HomeButton from "../components/Home/HomeButton";
import AnimeInfo, { Anime } from "../components/Game/AnimeInfo";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";

type UrlParams = {
  date: String;
};

export default function Game() {
  const anime = useLoaderData() as Anime;
  const { date } = useParams();
  const [score, setScore] = useState(5);
  const [fake, setFake] = useState<boolean>();

  async function vote(fake: boolean | undefined) {
    if (fake === undefined) {
      return;
    }
    if (!date) {
      const today = new Date();
      await axiosConfig.patch(
        `/daily/${today.getUTCFullYear()}-${padZero(
          today.getUTCMonth() + 1
        )}-${padZero(today.getUTCDate())}`,
        { fake, score }
      );
    } else {
      await axiosConfig.patch(`/daily/${date}`, { fake, score });
    }
  }

  return (
    <div className="flex md:basis-2/3 lg:basis-1/2 flex-col gap-4">
      <AnimeInfo anime={anime} />
      <div>
        <Rating
          onClick={(rating: number) => setScore(rating)}
          initialValue={5}
          iconsCount={10}
          allowFraction={true}
        />
      </div>
      <div className="flex justify-between gap-4">
        <HomeButton
          onClick={() =>
            setFake(fake === false || fake === undefined ? true : undefined)
          }
          active={fake === true}
        >
          Fake
        </HomeButton>
        <HomeButton
          onClick={() =>
            setFake(fake === true || fake === undefined ? false : undefined)
          }
          active={fake === false}
        >
          Real
        </HomeButton>
      </div>
      <HomeButton onClick={() => vote(fake)} disabled={fake === undefined}>
        Guess
      </HomeButton>
    </div>
  );
}

export async function todayLoader() {
  const today = new Date();
  const anime = await axiosConfig.get(
    `/daily/${today.getUTCFullYear()}-${padZero(
      today.getUTCMonth() + 1
    )}-${padZero(today.getUTCDate())}`
  );
  return anime.data;
}

export async function dateLoader({ params }: { params: any }) {
  const { date } = params as UrlParams;
  const anime = await axiosConfig.get(`/daily/${date}`);
  return anime.data;
}
