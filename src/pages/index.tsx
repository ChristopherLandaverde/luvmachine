import Head from "next/head";
import Image from "next/image";
import { Rubik, Roboto, Reenie_Beanie } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useEffect, useRef, useState } from "react";
import queryString from "query-string";

/* FONTS */

const rubik = Rubik({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] });
const reenie = Reenie_Beanie({ subsets: ["latin"], weight: "400", adjustFontFallback: false });

/* TYPES */

interface CardFormState {
  to: string;
  from: string;
  msg: string;
}

/* CONSTS */

const emptyFormState: CardFormState = {
  to: "",
  from: "",
  msg: "",
};

/* HISTORY PUSHSTATE */

// Ugh cause SSR
function getPage() {
  if (typeof window === "undefined") {
    return "greeting";
  }
  if (!window.location.hash || window.location.hash === "#") {
    return "greeting";
  }
  if (window.location.hash === "#edit") {
    return "edit";
  }
  return "view";
}

function saveFormState(formState: CardFormState) {
  const serializedState = queryString.stringify(formState);
  window.history.pushState(null, "", `#${window.btoa(serializedState)}`);
}

function parseFormClientState(): CardFormState {
  // Remove the #
  const parsedState = queryString.parse(
    window.atob(window.location.hash.substring(1)),
  );
  return parsedState as unknown as CardFormState;
}

function initMachine(): { initial: string; context: CardFormState } {
  // Ugh cause SSR
  if (typeof window === "undefined") {
    return { initial: "greeting", context: { ...emptyFormState } };
  }
  if (!window.location.hash || window.location.hash === "#") {
    return { initial: "greeting", context: { ...emptyFormState } };
  }
  if (window.location.hash === "#edit") {
    return { initial: "edit", context: { ...emptyFormState } };
  }
  return { initial: "view", context: { ...parseFormClientState() } };
}

/* XSTATE */

interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    resetState: "RESET";
    updateFormState: "CREATE";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: "edit" | "greeting" | "view";
  tags: never;
}

const luvMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCuA3AsgQwMYAsBLAOzADooAnMMAFxKgGIBxAUQBUB9AZXYEEASu1YARANoAGALqJQABwD2sQvQXFZIAB6IAjADYAzGQCcAdmP6ATGb0AWPcYCsADgA0IAJ6JnOsrfP6Ek4SzhISlnoAvpHuaFh4RKRkkCqMAMICrHzCkjJIIIrKqur52gi2jrZklhGOejoVDfU67l4IOhJVlqbOdpYGOjWmljo60TEgxAoQcBpxOAQkYBqFKoRqGmUAtHqtiFuOJsbHJ6cnBtGxGAuJ5FQ09MRQK0prG6WItpZ77Z1kpno6jpnJZHGC7AYLhN5gklskICoXkV1iVQGVIZZqv4DMZnP5bMcdJUfh0qgC6t1nAZLBIAYZLiAYYskuhCGAAO5It6orSIRymQ4AgwSBrGEIdQYkv7k+ogsF1WyQ8aRIA */
  createMachine(
    {
      ...initMachine(),
      id: "luvMachine",
      // initial: "edit",
      predictableActionArguments: true,
      tsTypes: {} as Typegen0,
      states: {
        greeting: {
          on: {
            GET_STARTED: "edit",
          },
        },
        edit: {
          on: {
            CREATE: { target: "view", actions: "updateFormState" },
          },
        },
        view: {
          entry(ctx) {
            // saveFormState(ctx);
          },
          on: {
            EDIT: "view",
          },
        },
      },
      on: {
        RESET: { target: "greeting", actions: "resetState" },
      },
    },
    {
      actions: {
        resetState: assign({ ...emptyFormState }),
        updateFormState: assign((ctx, { from, to, msg }) => {
          return { from, to, msg };
        }),
      },
    },
  );

/* COMPONENTS */

function Preview({ to, from, msg }: { to: string; from: string; msg: string }) {
  return (
    <div
      className={`text-4xl bg-white rounded-lg p-8 border border-black ${reenie.className}`}
    >
      <div className="mb-8">Dear {to},</div>
      <div className="text-3xl p-2">{msg}</div>
      <div className="text-right mt-8">From {from}</div>
    </div>
  );
}

interface CardFormProps {
  onCreate: (to: string, from: string, msg: string) => void;
}

function CardForm({ onCreate }: CardFormProps) {
  const [toText, setToText] = useState<string>("");
  const [fromText, setFromText] = useState<string>("");
  const [msgText, setMsgText] = useState<string>("");

  return (
    <div>
      <label className="block mb-4">
        <span className="block text-xl mb-2">To:</span>
        <input
          className="block border border-black w-full h-[50px] rounded-md p-2"
          type="text"
          value={toText}
          onChange={(evt) => setToText(evt.target.value)}
        />
      </label>
      <label className="block mb-8">
        <span className="block text-xl mb-2">From:</span>
        <input
          className="block border border-black w-full h-[50px] rounded-md p-2"
          type="text"
          value={fromText}
          onChange={(evt) => setFromText(evt.target.value)}
        />
      </label>
      <label className="block mb-8">
        <span className="block text-xl mb-2">Message:</span>
        <textarea
          className="block border border-black h-[170px] w-full rounded-md p-2"
          value={msgText}
          onChange={(evt) => setMsgText(evt.target.value)}
        />
      </label>
      {toText && fromText && msgText && (
        <div className="mb-8 ">
          <div className="text-xl mb-2">Preview:</div>
          <Preview to={toText} from={fromText} msg={msgText} />
        </div>
      )}
      <div>
        <button
          className="w-full text-white bg-primary p-2 rounded-full text-lg"
          onClick={() => onCreate(toText, fromText, msgText)}
        >
          Publish
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [current, send] = useMachine(luvMachine);
  // Ugh, Next.js
  const shouldNotRender = useDisableSSR();

  // usePopState(() => {
  //   const formState = getPage();
  //   switch (formState) {
  //     case "greeting":
  //       send({ type: "RESET" });
  //       break;
  //     case "edit":
  //       send({ type: "EDIT" });
  //       break;
  //     case "view":
  //       send({ type: "RESET" });
  //       break;
  //   }
  // });

  return shouldNotRender ? null : (
    <>
      <Head>
        <title>Luv Machine</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${roboto.className} bg-secondary`}>
        <div className="max-w-sm mx-auto">
          {current.matches("greeting") && (
            <div className="mt-24 mb-36">
              <div className="flex justify-center mb-18">
                <div className="rounded-lg text-sm text-white p-8">
                  <Image src="/cuate.png" alt={""} height="250" width="250" />
                </div>
              </div>
              <h1
                className={`text-5xl font-bold text-center mb-4 ${rubik.className}`}
              >
                Luv Machine
              </h1>
              <h2 className="text-md text-center mb-12">
                The Only Valentine's Day Card You Need
              </h2>
              <h2 className="text-md text-center mb-12">
                Let Us "State" Your Message!
              </h2>
              <div className="text-center">
                <button
                  className="text-white bg-primary p-4 rounded-full text-lg w-[200px]"
                  onClick={() => {
                    send({ type: "GET_STARTED" });
                    // window.history.pushState(null, "", "#edit");
                  }}
                >
                  Get started
                </button>
              </div>
            </div>
          )}
          {current.matches("edit") && (
            <div className="p-4 mt-12">
              <CardForm
                onCreate={(t, f, m) =>
                  send({ type: "CREATE", to: t, from: f, msg: m })
                }
              />
            </div>
          )}
          {current.matches("view") && (
            <div className="p-4 mt-12">
              <div className="flex justify-center">
                <Image src="/rafiki.png" alt={""} height="300" width="300" />
              </div>
              <div className="text-center mt-8 mb-4">
                <p className={`${rubik.className} text-lg font-bold`}>
                  Congrats! You Finished Your Card!
                </p>
              </div>
              <div className="mb-8">
                <Preview {...current.context} />
              </div>
              <div className="text-center">
                <div className="mb-4">
                  <button className="text-white bg-primary p-4 rounded-full text-lg w-[200px]">
                    Share
                  </button>
                </div>
                <div>
                  <button className="text-white bg-primary p-4 rounded-full text-lg w-[200px]">
                    Start Another Card
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function useDisableSSR(): boolean {
  const [disableSSR, setDisableSSR] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDisableSSR(false);
    }
  }, []);

  return disableSSR;
}

// function usePopState(callback: () => void) {
//   useEffect(() => {
//     window.addEventListener("popstate", callback);
//     return () => window.removeEventListener("popstate", callback);
//   }, []);
// }
