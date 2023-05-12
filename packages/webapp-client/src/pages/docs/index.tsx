import fs from 'fs';
import { GetStaticProps, NextPage } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

import { MDXComponents } from 'mdx/types';
import path from 'path';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Docs from '../../components/Docs/Docs';
import PageContent from '../../components/PageContent/PageContent';

const components: MDXComponents = {
  pre: (props) => <pre {...props} />,
  code: CodeBlock,
};

interface PageProps {
  mdxSource: MDXRemoteSerializeResult;
}

const myDocument: NextPage<PageProps> = ({ mdxSource }) => {
  return (
    <PageContent>
      <Docs>
        <MDXRemote {...mdxSource} components={components} />
      </Docs>
    </PageContent>
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
