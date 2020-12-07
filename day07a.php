<?php

    $container = ['shiny gold' => []];

    preg_replace_callback('#([a-z ]+) bags contain (.+?\.)#', function ($m) use (&$container) {
        preg_replace_callback('#(\d+) ([a-z ]+) bags?[\.,]#', function ($mm) use (&$container, $m) {
            if (!isset($container[$mm[2]])) $container[$mm[2]] = [];
            $container[$mm[2]][] = $m[1];
        }, $m[2]);

    }, file_get_contents('input07.txt'));

    $colors = [];
    $scan = function ($color) use (&$scan, &$colors, &$container) {
        if (empty($container[$color])) return;
        foreach ($container[$color] as $possibleColor) {
            if (isset($colors[$possibleColor])) continue;
            $colors[$possibleColor] = true;
            $scan($possibleColor);
        }
    };

    $scan('shiny gold');
    printf("%d\n", count($colors));
