import styled from "styled-components"
import { Logo } from "../form/FormStyle"

export const HeaderWrapper = styled.div`
    position: fixed;
    left: 0;
    width: 100%;
    height: 7vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dbdbdb;
    margin-bottom: 1rem;
    padding: 1rem 15rem;
    background-color: #fafafa;
    z-index: 1000;
`

export const HeaderLogo = styled(Logo)`
    flex: 1;
    font-size: 36px;
`

export const HeaderSearch = styled.input`
    margin: auto;
    width: 20vw;
    height: 2rem;
    padding: 0.5rem;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
`

export const HeaderNav = styled.ul`
    flex: 1;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 15rem;
`

export const HeaderButton = styled.li`
    list-style: none;
    cursor: pointer;
    
    & :hover {
        color: #bbb;
    }
    
    & i {
        font-size: 28px;    
    }
    
    & .fa-facebook-messenger:hover {
        color: #7cc3ff;
    }
    
    & .fa-heart:hover {
        color: #ffb0b0;
    }

    & .fa-compass:hover {
        color: #b6ffd0;
    }
`