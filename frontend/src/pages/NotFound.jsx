import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="v-weave-bg v-min-vh d-flex align-items-center">
      <div className="container text-center py-5">
        <div className="display-1 mb-2">🧵</div>
        <h1 className="display-5 mb-2">Page not found</h1>
        <p className="lead text-muted-2 mb-4">
          This thread seems to have unravelled. Let's get you back on the loom.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-primary btn-lg">Back home</Link>
          <Link to="/studio" className="btn btn-outline-primary btn-lg">Open Design Studio</Link>
        </div>
      </div>
    </div>
  );
}
