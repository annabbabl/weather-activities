import ReactLoading from 'react-loading';

export default function Loading() {
  return (
    <div className="loading">
      <ReactLoading type="spinningBubbles" color="#007bff" height={100} width={100} />
    </div>
  );
}
