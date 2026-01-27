import { ReactNode } from 'react';

export default ({ is, children }: { is: boolean; children: ReactNode }) => {
  return <>{is ? children : null}</>;
};
