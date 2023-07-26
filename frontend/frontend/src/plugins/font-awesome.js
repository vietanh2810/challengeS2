import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faHome,
    faUser,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt,
    faStepBackward,
    faStepForward,
    faChevronLeft,
    faChevronRight,
    faSortDown,
    faSortUp,
    faSort,
} from "@fortawesome/free-solid-svg-icons";

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt , 
            faStepBackward, faStepForward, faChevronLeft, 
            faChevronRight, faSortDown, faSortUp, faSort);

export { FontAwesomeIcon };