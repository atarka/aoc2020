<?php

    $container = [];

    preg_replace_callback('#([a-z ]+) bags contain (.+?\.)#', function ($m) use (&$container) {
        $container[$m[1]] = [];
        preg_replace_callback('#(\d+) ([a-z ]+) bags?[\.,]#', function ($mm) use (&$container, $m) {
            $container[$m[1]][] = (object) ['color' => $mm[2], 'count' => $mm[1]];
        }, $m[2]);
    }, file_get_contents('input07.txt'));

    $scan = function ($color, $count) use (&$scan, &$container) {
        return $count * array_reduce($container[$color]??[], fn($a, $n) => $a + $scan($n->color, $n->count), 1);
    };

    printf("%d\n", $scan('shiny gold', 1) - 1);
