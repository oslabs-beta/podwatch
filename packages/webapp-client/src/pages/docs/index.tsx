import { GetStaticProps, NextPage } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'fs';

import CodeBlock from '../../components/CodeBlock/CodeBlock';
import styles from './docs.module.scss';
import { MDXComponents } from 'mdx/types';
import path from 'path';

const components: MDXComponents = {
  pre: (props) => <pre {...props} />,
  code: CodeBlock,
};

interface PageProps {
  mdxSource: MDXRemoteSerializeResult;
}

const myDocument: NextPage<PageProps> = ({ mdxSource }) => {
  return (
    <div className={styles.docs}>
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  mdxSource: MDXRemoteSerializeResult;
}> = async () => {
  const mdxComponent = fs.readFileSync(
    path.resolve('./public/docs/docs.mdx'),
    'utf8'
  );
  const mdxSource = await serialize(mdxComponent);
  return { props: { mdxSource } };
};

export default myDocument;
