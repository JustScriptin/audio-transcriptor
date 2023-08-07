import ReactMarkdown from "react-markdown";
import styles from "./MarkdownInterpreter.module.scss";


interface MarkdownProps {
    markdown: string;
  }

const MarkdownInterpreter = ({ markdown }: MarkdownProps) => {
  return <ReactMarkdown className={styles.markdown}>{markdown}</ReactMarkdown>;
};

export default MarkdownInterpreter;