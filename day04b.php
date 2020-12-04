<?php

    $proper = ['byr cid ecl eyr hcl hgt iyr pid', 'byr ecl eyr hcl hgt iyr pid'];
    $eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
    $btwn = fn ($value, $from, $to) => is_numeric($value) && $value >= $from && $value <= $to;

    $validation = [
        'byr' => fn ($year) => $btwn($year, 1920, 2002),
        'iyr' => fn ($year) => $btwn($year, 2010, 2020),
        'eyr' => fn ($year) => $btwn($year, 2020, 2030),
        'hgt' => fn ($height, $m = null) =>
            preg_match('#^([0-9]+)(cm|in)$#', $height, $m)
            && ($m[2] == 'cm' ? $btwn($m[1], 150, 193) : $btwn($m[1], 59, 76)),
        'hcl' => fn ($color) => preg_match('#^\#[0-9a-fA-F]{6}$#', $color),
        'ecl' => fn ($color) => in_array($color, $eyeColors),
        'pid' => fn ($id) => preg_match('#^[0-9]{9}$#', $id),
    ];

    $validatePassports = function($passports) use ($proper, $validation) {
        $valid = 0;

        foreach ($passports as $passport) {
            $fields = [];
            foreach (preg_split('#[\r\n \t]+#', $passport) as $pair) {
                list ($key, $value) = explode(':', $pair, 2);
                if (isset($validation[$key])) {
                    if (!$validation[$key]($value)) continue 2;
                }
                $fields[$key] = $value;
            }

            $keys = array_keys($fields);
            sort($keys);
            if (in_array(join(' ', $keys), $proper)) {
                ++$valid;
            }
        }

        return $valid;
    };

    $passports = preg_split('#(\r?\n){2,}#', file_get_contents('input04.txt'));
    printf("%d\n", $validatePassports($passports));

