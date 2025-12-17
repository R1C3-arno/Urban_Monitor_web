import { THEME } from '../constants/pharmacyConfig';
import {Search} from "lucide-react";

const SearchButton = ({ onClick }) => {
    return (
        <div style={{ padding: '0 12px 12px' }}>
            <button
                onClick={onClick}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: THEME.secondary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    display: 'flex',
                    gap: '12px',
                }}
            >
                <Search />
                Search in this area
            </button>
        </div>
    );
};

export default SearchButton;
