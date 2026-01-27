'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default () => {
  return (
    <>
      <ProgressBar height="4px" color="#539dfd" options={{ showSpinner: false }} shallowRouting />
    </>
  );
};
