import { AnimeAnswer, Answer } from "../../routes/Game";
import HomeButton from "../Home/HomeButton";
import { vote } from "../../common/helper";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useHistoryState } from "../../store/store";
import { AnimeHidden, RatingHidden, TitleHidden } from "./AnimeStats";
import Check from "../Icons/Check";
import XMark from "../Icons/XMark";
import Play from "../Icons/Play";
import { useCaptcha } from "../../hooks/useCaptcha";

type AnimeModeProps = {
  setAnswer: (anime: AnimeAnswer) => void;
  anime: AnimeHidden | RatingHidden | TitleHidden;
  setLoading: (loading: boolean) => void;
};

export type HistoryItem = Answer & {
  answer: boolean | number;
};

export type History = {
  anime: Record<string, HistoryItem & AnimeHidden>;
  rating: Record<string, HistoryItem & RatingHidden>;
  title: Record<string, HistoryItem & TitleHidden>;
};

export default function AnimeMode({
  setAnswer,
  anime,
  setLoading,
}: AnimeModeProps) {
  const { date, mode } = useParams();
  const [fake, setFake] = useState<boolean>();
  const [history, setHistory] = useHistoryState();
  const { captchaRef } = useCaptcha();
  async function submit() {
    if (fake === undefined) {
      return;
    }
    setLoading(true);
    const token = await captchaRef.current!.executeAsync();
    captchaRef.current!.reset();
    setAnswer(
      (await vote(
        date,
        mode,
        fake,
        JSON.parse(history),
        setHistory,
        anime,
        token || ""
      )) as AnimeAnswer
    );
    setLoading(false);
  }

  return (
    <div>
      <p className="text-[10px] pb-4">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </p>
      <div className="flex justify-between gap-4 mb-4">
        <div className="w-full border-4 border-pink-900">
          <HomeButton
            onClick={() =>
              setFake(fake === false || fake === undefined ? true : undefined)
            }
            active={fake === true}
          >
            <div className="flex justify-center items-center gap-2">
              <XMark />
              Fake
            </div>
          </HomeButton>
        </div>
        <div className="w-full border-4 border-pink-900">
          <HomeButton
            onClick={() =>
              setFake(fake === true || fake === undefined ? false : undefined)
            }
            active={fake === false}
          >
            <div className="flex justify-center items-center gap-2">
              <Check />
              Real
            </div>
          </HomeButton>
        </div>
      </div>
      <div className="border-4 border-pink-900">
        <HomeButton onClick={() => submit()} disabled={fake === undefined}>
          <div className="flex justify-center items-center gap-2">
            <Play />
            Guess
          </div>
        </HomeButton>
      </div>
    </div>
  );
}
