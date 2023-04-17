import { Component, Match, Switch, createSignal, onMount } from "solid-js";

const constraints = {
  audio: false,
  video: {
    height: {
      exact: 640,
    },
    width: {
      exact: 360,
    },
  },
};
const App: Component = () => {
  let stream: MediaStream;
  let videoRef: HTMLVideoElement;
  let canvasRef: HTMLCanvasElement;
  let faceRef: HTMLDivElement;

  const [streaming, setStreaming] = createSignal(false);
  const [capturedImg, setCapturedImg] = createSignal("");

  async function requestMediaStream() {
    try {
      setStreaming(true);
      setCapturedImg("");
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.srcObject = stream;
    } catch (error) {
      console.log(error);
    }
  }
  onMount(() => {
    requestMediaStream();
  });

  function handleTakePhoto() {
    const faceRect = faceRef.getBoundingClientRect();
    const context = canvasRef.getContext("2d");

    const x = 0;
    const y = 0;
    const w = faceRect.width;
    const h = faceRect.height;

    canvasRef.width = w;
    canvasRef.height = h;
    context?.drawImage(videoRef, x, y, w, h, 0, 0, w, h);
    const data = canvasRef.toDataURL("image/png");
    setCapturedImg(data);
    setStreaming(false);
  }

  function handleCloseImg() {
    requestMediaStream();
  }

  return (
    <div class="max-h-[640px] w-full h-full  absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  max-w-[360px]">
      <div class="relative w-full h-full  shadow-md border-2 bg-transparent">
        <Switch>
          <Match when={streaming()}>
            <div class="w-full h-full">
              <video
                // @ts-ignore
                ref={videoRef}
                playsinline
                autoplay
                muted
                class="w-full h-full  bg-black "
              />
              <div
                //  @ts-ignore
                ref={faceRef}
                class="absolute top-0 left-0 right-0 border-dotted border-4 border-white m-4  rounded-full  h-[450px]"
              ></div>

              <div class="absolute bottom-0 px-4 py-4 flex flex-col space-y-4 items-center">
                <p class="px-4 text-center text-white">
                  Place the face in the oval and capture
                </p>
                <button
                  onClick={handleTakePhoto}
                  title="Take photo"
                  class="w-16 h-16 bg-red-500 rounded-full border-white border-4 "
                ></button>
              </div>
            </div>
          </Match>
          <Match when={capturedImg()}>
            <div class="relative w-full h-full bg-black p-4">
              <img src={capturedImg()} class="w-auto h-auto rounded-full" />
              <div class="absolute bottom-0 left-0 right-0">
                <div class="flex items-center justify-center gap-4 p-4 text-white">
                  <button
                    onClick={handleCloseImg}
                    class="h-10 w-10 grid place-items-center bg-red-500 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
      {/* @ts-ignore */}
      <canvas hidden ref={canvasRef} />
    </div>
  );
};

export default App;
