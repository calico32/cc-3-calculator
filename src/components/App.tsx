import React from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { AppBar } from './AppBar';
import { Footer } from './Footer';
import { Spinner } from './Spinner';

const { Suspense, useEffect, useState } = React;

const Home = React.lazy(() => import('../home/Home'));
const Calculator = React.lazy(() => import('../calculator/Calculator'));
const About = React.lazy(() => import('../about/About'));

const Loading = () => (
  <div className="flex items-center justify-center h-full">
    <Spinner />
  </div>
);

export default (): JSX.Element => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);

const Main = (): JSX.Element => {
  const location = useLocation();

  const [dark, setDark] = useState(
    (document.querySelector('html') as HTMLElement).classList.contains('dark')
  );

  useEffect(() => {
    (document.querySelector('html') as HTMLElement).classList[dark ? 'add' : 'remove']('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <AppBar dark={dark} setDark={setDark} />
      <TransitionGroup className="relative">
        <CSSTransition key={location.key} classNames="fade" timeout={75}>
          <div className="absolute inset-0 w-full">
            <main className="flex flex-col m-4 mt-20 text-gray-700 dark:text-gray-400 font-body">
              <Switch location={location}>
                <Route exact path="/">
                  <Suspense fallback={<Loading />}>
                    <Home className="flex-1" />
                  </Suspense>
                </Route>
                <Route path="/calculator">
                  <Suspense fallback={<Loading />}>
                    <Calculator className="flex-1 overflow-hidden" />
                  </Suspense>
                </Route>
                <Route path="/about">
                  <Suspense fallback={<Loading />}>
                    <About className="flex-1" />
                  </Suspense>
                </Route>
              </Switch>
              <Footer />
            </main>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};
