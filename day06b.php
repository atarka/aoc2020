<?php

    function c($group) {
        $lines = array_map(fn ($line) => str_split($line), preg_split('#\r?\n#', $group));
        return count(array_reduce($lines, fn ($a, $p) => array_intersect($a, $p), $lines[0]));
    }

    $groups = preg_split('#(\r?\n){2,}#', file_get_contents('input06.txt'));
    $total = array_reduce($groups, fn($a, $g) => $a + c($g), 0);
    printf("%d\n", $total);