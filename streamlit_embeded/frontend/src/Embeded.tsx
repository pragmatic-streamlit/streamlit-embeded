import { useEffect, useState } from "react"
import { ComponentProps, Streamlit, withStreamlitConnection } from "streamlit-component-lib";

// eslint-disable-next-line import/no-webpack-loader-syntax
import iframeResizerAgentSource from "!!raw-loader!iframe-resizer/js/iframeResizer.contentWindow"
import iframeResizer from "iframe-resizer/js/iframeResizer"
import { idText } from "typescript";

interface EmbededProps extends ComponentProps {
  args: {
    html: string
    height: number
    key: string
  }
}

const iframeResizerAgent = document.createElement("script")
iframeResizerAgent.innerHTML = iframeResizerAgentSource
iframeResizerAgent.type = "text/javascript"
iframeResizerAgent.async = true

const handleHeight = ({ height }: any) => {
  Streamlit.setFrameHeight(height)
}
 
const Embeded = ({ args }: EmbededProps) => {
  const [html, setHtml] = useState("") 
  const key = args.key;
  const id = `embeded-${key}`;

  useEffect(() => {
    const fixedHeightProps = (args.height === null) ? {
      scrolling: false,
      autoResize: true
    } : {
      maxHeight: args.height,
      scrolling: false,
      autoResize: true
    }

    const iframe = iframeResizer({
      checkOrigin: false,
      onResized: handleHeight,
      ...fixedHeightProps,
    }, `#${id}`)

    return () => {
      iframe.close()
    }
  }, [args.height])

  useEffect(() => {
    const container = document.createElement("html")
    container.innerHTML = args.html

    container.querySelector("head")?.appendChild(iframeResizerAgent)
    container.querySelectorAll("a").forEach((element: HTMLAnchorElement) => {
      element.target = "_blank"
    })

    setHtml(container.innerHTML)
    container.remove()
  }, [args.html])
  var blob = new Blob(
    [html],
    {
      type: 'text/html',
    },
  );
  const url = URL.createObjectURL(blob);
  return (
    <iframe
      id={id}
      width="100%"
      frameBorder={0}
      src={url}
      //srcDoc={html}
    />
  )
}

export default withStreamlitConnection(Embeded)
