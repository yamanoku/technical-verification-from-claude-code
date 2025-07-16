import type { ButtonColor, ButtonSize, ButtonVariant, CheckboxColor, ProgressAnimation, ProgressColor } from '../../types/index.js';
declare const _default: {
    wrapper: string;
    base: string;
    divide: string;
    thead: string;
    tbody: string;
    caption: string;
    tr: {
        base: string;
        selected: string;
        expanded: string;
        active: string;
    };
    th: {
        base: string;
        padding: string;
        color: string;
        font: string;
        size: string;
    };
    td: {
        base: string;
        padding: string;
        color: string;
        font: string;
        size: string;
    };
    checkbox: {
        padding: string;
    };
    loadingState: {
        wrapper: string;
        label: string;
        icon: string;
    };
    emptyState: {
        wrapper: string;
        label: string;
        icon: string;
    };
    expand: {
        icon: string;
    };
    progress: {
        wrapper: string;
    };
    default: {
        sortAscIcon: string;
        sortDescIcon: string;
        sortButton: {
            icon: string;
            trailing: boolean;
            square: boolean;
            color: ButtonColor;
            variant: ButtonVariant;
            class: string;
        };
        expandButton: {
            icon: string;
            color: ButtonColor;
            variant: ButtonVariant;
            size: ButtonSize;
            class: string;
        };
        checkbox: {
            color: CheckboxColor;
        };
        progress: {
            color: ProgressColor;
            animation: ProgressAnimation;
        };
        loadingState: {
            icon: string;
            label: string;
        };
        emptyState: {
            icon: string;
            label: string;
        };
    };
};
export default _default;
