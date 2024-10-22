import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function Loading() {
    return ( 
        <div className="flex items-center justify-center h-screen">
        <FontAwesomeIcon 
              icon={faSpinner} 
              className="fa-4x text-blue-500 animate-spin"
            />
      </div>
     );
}

export default Loading;