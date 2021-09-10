import { Helmet } from "react-helmet";
import defaultFavIcon from "./../resources/w.png";

const Head = (
  props: {
    title: string;
    description: string;
    favicon: string;
  } & typeof defaultProps
) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta name="keyword" content="smartphones, cell phones, buy gadgets" />
      <link rel="shortcut icon" href={props.favicon} type="image/png" />
    </Helmet>
  );
};

const defaultProps = {
  title: "W-SHOP Online Electronics Store",
  extraText: "",
  description: "Online Smartphones Store that sells cheap and reliable gadgets",
  favicon: defaultFavIcon,
};
Head.defaultProps = defaultProps;

export default Head;
