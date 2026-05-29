import type { ImportMap } from "payload";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import configPromise from "@payload-config";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: configPromise, params, searchParams });

const importMap: ImportMap = {};

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config: configPromise, importMap, params, searchParams });

export default Page;
