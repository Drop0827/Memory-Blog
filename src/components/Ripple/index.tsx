import './index.scss';

export default () => {
  return (
    <>
      <div className="rippleComponent">
        <div className="ripple">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
            </defs>

            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" className="fill-[rgba(249,249,249,0.7)] dark:fill-[rgba(35,41,49,0.9)]"></use>
              <use xlinkHref="#gentle-wave" x="48" y="3" className="fill-[rgba(249,249,249,0.5)] dark:fill-[rgba(35,41,49,0.9)]"></use>
              <use xlinkHref="#gentle-wave" x="48" y="5" className="fill-[rgba(249,249,249,0.3)] dark:fill-[rgba(35,41,49,0.9)]"></use>
              <use xlinkHref="#gentle-wave" x="48" y="7" className="fill-[rgba(249,249,249)] dark:fill-[rgba(35,41,49,0.9)]"></use>
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};
