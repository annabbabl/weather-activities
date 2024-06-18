import ReactLoading from 'react-loading';

/**
 * Functional React component for displaying a loading animation.
 * This component utilizes the 'react-loading' library to render a spinning bubbles animation
 * to indicate that an asynchronous operation, like data fetching or processing, is currently ongoing.
 * The animation is centered on the page or container it's placed in.
 *
 * @component
 * @example
 * <Loading />
 *
 * @returns {React.ReactElement} A React component displaying a spinning bubbles loading animation.
 */

export default function Loading() {
  return (
    <div className="loading flex flex-col justify-center items-center">
      <ReactLoading type="spinningBubbles" color="#007bff" height={100} width={100} />
    </div>
  );
}
