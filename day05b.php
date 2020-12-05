<?php

    $seats = array_map(fn ($s) => bindec(strtr($s, 'FBLR', '0101')), file('input05.txt'));
    sort($seats);
    printf("%s\n", -array_reduce($seats, fn ($a, $s) => $a < 0 ? $a : (!$a ? $s : ($s - $a == 1 ? $s : -$s + 1)), 0));