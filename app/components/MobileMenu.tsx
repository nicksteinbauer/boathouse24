import { Component } from 'react';
import Menu from './Menu';

interface MobileMenuState {
    open: boolean;
}

export class MobileMenu extends Component<{}, MobileMenuState> {
    state: MobileMenuState = {
        open: false,
    };

    handleButtonClick = (): void => {
        this.setState((state) => ({
            open: !state.open,
        }));
    };

    render() {
        return (
            <>
                <div className={this.state.open ? "hamburger active" : "hamburger"}>
                    <div
                        className="ham-trigger flex-vertical"
                        onClick={this.handleButtonClick}
                        onKeyDown={this.handleButtonClick}
                        role="button"
                        tabIndex={0}
                    >
                        <div className={this.state.open ? "ham-button active" : "ham-button"}>
                            <span className="line line-1"></span>
                            <span className="line line-2"></span>
                            <span className="line line-3"></span>
                        </div>
                    </div>
                </div>

                {this.state.open && (
                    <menu className="navigation">
                        <div className="nav-buffer">
                            <div className="inside-sm flex-vertical-modified text-center">
                                <Menu />
                            </div>
                        </div>
                    </menu>
                )}
            </>
        );
    }
}

export default MobileMenu;
