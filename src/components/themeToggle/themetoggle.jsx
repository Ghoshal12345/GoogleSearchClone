import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './ActionToggle.module.css';

function ThemeToggle(props) {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const nextColorScheme = computedColorScheme === 'light' ? 'dark' : 'light';

    return (
        <Group justify="center" {...props}>
            <ActionIcon
                onClick={() => setColorScheme(nextColorScheme)}
                variant="default"
                size="xl"
                radius="md"
                aria-label="Toggle color scheme"
                className=' transition-transform duration-200'
            >
                {computedColorScheme === 'light' ? (
                    <IconMoon className={classes.icon} stroke={1.5} />
                ) : (
                    <IconSun className={classes.icon} stroke={1.5} />
                )}
            </ActionIcon>
        </Group>
    );
}

export default ThemeToggle;
