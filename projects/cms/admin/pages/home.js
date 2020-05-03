import React from 'react';

import { Container } from '@arch-ui/layout';
import { gridSize } from '@arch-ui/theme';
import { PageTitle } from '@arch-ui/typography';

const HeaderInset = props => (
  <div css={{ paddingLeft: gridSize * 2, paddingRight: gridSize * 2 }} {...props} />
);

const Home = () => (
  <Container isFullWidth>
    <HeaderInset>
      <PageTitle>
        Home
      </PageTitle>
      <p>
        Welcome to the new HackGT CMS! Click a list on the left to get started.
      </p>
    </HeaderInset>
  </Container>
);

export default Home;
