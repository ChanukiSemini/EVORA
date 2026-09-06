import Icon from './Icon.jsx';

export default function Header({ onBack, onOpenDrawer, isDrawerOpen, title = 'Rate Charging Session' }) {
    return (
        <header className="nav-bar">
            <button className="nav-back" aria-label="Go back" onClick={onBack}>
                <Icon name="icon-arrow-left" size={24} />
            </button>

            <h1 className="nav-title">{title}</h1>

            <button
                className="hamburger-btn"
                aria-label="Open navigation drawer"
                aria-expanded={isDrawerOpen}
                aria-controls="drawer"
                onClick={onOpenDrawer}
            >
                <Icon name="icon-menu" size={24} />
            </button>
        </header>
    );
}
