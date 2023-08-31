-- COMP3311 23T1 Assignment 1
-- Done by Ezekiel Tay Z5378748 on 14/3/2023

-- Q1: amount of alcohol in the best beers
-- put any Q1 helper views/functions here

create or replace view Q1(beer, "sold in", alcohol)
as
select name, (volume || 'ml ' || sold_in), cast(volume * abv/100 as decimal(5,1)) || 'ml'
from beers
where rating > 9;

-- Q2: beers that don't fit the ABV style guidelines

-- put any Q2 helper views/functions here

-- Create a vuew on the combination of beers and styles
create or replace view combine_styles(beer, style, abv, max_abv, min_abv)
as
select b.name, s.name, b.abv::ABVvalue, s.max_abv, s.min_abv,
case
	when b.abv > s.max_abv then 'too strong by ' || (b.abv - s.max_abv)::numeric(4,1) || '%'
	when b.abv < s.min_abv then 'too weak by ' || (s.min_abv - b.abv)::numeric(4,1) || '%'
end
from beers b 
	join styles s on (b.style = s.id);

create or replace view Q2(beer, style, abv, reason)
as
select beer, style, abv::ABVvalue, s.case
from combine_styles s
where abv > max_abv or abv < min_abv;


-- Q3: Number of beers brewed in each country

-- put any Q3 helper views/functions here

-- View of overall data of beers linked to the countries
create or replace view country_data(id, beers)
as
select l.within, b.name
from beers b
	join Brewed_by i on (i.beer = b.id)
	join Breweries w on (i.brewery = w.id)
	join locations l on (w.located_in = l.id);


create or replace view Q3(country, "#beers")
as
select c.name, count(d.id)::bigint 
from countries c left outer join country_data d on (c.id = d.id)
group by c.name;

-- Q4: Countries where the worst beers are brewed

-- put any Q4 helper views/functions here

create or replace view Q4(beer, brewery, country)
as
select b.name, w.name, c.name
from beers b
	join Brewed_by i on (i.beer = b.id)
	join Breweries w on (i.brewery = w.id)
	join locations l on (w.located_in = l.id)
	join countries c on (l.within = c.id)
where b.rating < 3;

-- Q5: Beers that use ingredients from the Czech Republic

-- put any Q5 helper views/functions here

create or replace view Q5(beer, ingredient, "type")
as
select b.name, i.name, i.itype::IngredientType  
from beers b
	join contains k on (b.id = k.beer)
	join ingredients i on (k.ingredient = i.id)
	join countries c on (i.origin = c.id)
where c.name = 'Czech Republic';

-- Q6: Beers containing the most used hop and the most used grain

-- put any Q6 helper views/functions here

--View of a beer name, ingredient name and ingredient type
create or replace view beer_data(beer_name, i_name, i_type)
as
select b.name, i.name, i.itype
from beers b
	join contains k on (b.id = k.beer)
	join ingredients i on (k.ingredient = i.id);

-- View of all beer containing hop.
create or replace view hop_list(beer_ingredient, count)
as
select i_name, count(i_name)
from beer_data
where i_type = 'hop'
group by i_name;

-- Obtain the most popular hop ingredient
create or replace view best_hop(beer_ingredient)
as
select beer_ingredient
from hop_list
where count = (select max(count) from hop_list);

-- View of all beer containing grain.
create or replace view grain_list(beer_ingredient, count)
as
select i_name, count(i_name)
from beer_data
where i_type = 'grain'
group by i_name;

-- Obtain the most popular grain ingredient
create or replace view best_grain(beer_ingredient)
as
select beer_ingredient
from grain_list
where count = (select max(count) from grain_list);

-- Function to Obtain the beer with the most popular Hop ingredients
create or replace function
	beer_with_best_hop() returns setof beer_data
as
$$
declare 
	ingredient_name text;
begin
	for ingredient_name in (select beer_ingredient from best_hop) loop
		return query (select * from beer_data b where i_name = ingredient_name);
	end loop;
end;
$$ language plpgsql;

-- Obtain the beer with the most popular Grain ingredients
create or replace function
	beer_with_best_grain() returns setof beer_data
as
$$
declare 
	ingredient_name text;
begin
	for ingredient_name in (select beer_ingredient from best_grain) loop
		return query (select * from beer_data b where i_name = ingredient_name);
	end loop;
end;
$$ language plpgsql;


create or replace view Q6(beer)
as 
(select beer_name from beer_with_best_hop())
intersect
(select beer_name from beer_with_best_grain());


-- Q7: Breweries that make no beer

-- put any Q7 helper views/functions here
-- View containing brewery name and beer brewed
create or replace view breweries_data(brewery_name, beer_name)
as
select w.name, b.name  
from beers b
	join brewed_by y on (b.id = y.beer)
	right outer join breweries w on (y.brewery = w.id);

create or replace view Q7(brewery)
as
select brewery_name  
from breweries_data
where beer_name is null;

-- Q8: Function to give "full name" of beer

-- put any Q8 helper views/functions here
-- View containing beer id, beer name and brewery name
create or replace view all_beers(beer_id, beer_name, brewery_name)
as
select b.id, b.name, w.name
from beers b
	join brewed_by y on (b.id = y.beer)
	join breweries w on (y.brewery = w.id)
order by w.name;

-- Function that returns setof all_beers with the brewery name being filtered according to specs
create or replace function
	check_beer_exist(beer_id integer) returns setof all_beers
as
$$
select beer_id, beer_name,
case
	when brewery_name like 'Beer%' or brewery_name like 'Brew%' then brewery_name
	when brewery_name like '%Beer%' then SUBSTRING (brewery_name, 0 , position('Beer' in brewery_name) - 1)
	when brewery_name like '%Brew%' then SUBSTRING (brewery_name, 0 , position('Brew' in brewery_name) - 1)
end
from all_beers where beer_id = $1;
$$ language sql;


create or replace function
	Q8(beer_id integer) returns text
as
$$
declare 
	beer_count integer;
begin
	select count (brewery_name) into beer_count from check_beer_exist(beer_id);
	if beer_count > 1 then
		return (select min(brewery_name) from check_beer_exist(beer_id)) || ' + ' ||
		(select max(brewery_name) from check_beer_exist(beer_id)) || ' ' ||
		(select min(beer_name) from check_beer_exist(beer_id));
	elsif beer_count > 0 then
		return (select brewery_name from check_beer_exist(beer_id)) || ' ' ||
		(select beer_name from check_beer_exist(beer_id));
	else
		return 'No such beer';
	end if;
end;
$$ language plpgsql;

-- Q9: Beer data based on partial match of beer name
-- put any Q9 helper views/functions here

-- Create a generic table of all beers and their ingredients
create or replace view beer_list(beer_id, beer_name, brewery_name, i_name, i_type)
as
select b.id, b.name, w.name, i.name, i.itype
from beers b
	left outer join brewed_by y on (b.id = y.beer)
	join breweries w on (y.brewery = w.id)
	left outer join contains c on (b.id = c.beer)
	left outer join ingredients i on (c.ingredient = i.id)
order by b.name;

-- return list of target beers that contain the partial string.
create or replace function
	target_beers(partial_name text) returns setof beer_list
as
$$
select beer_id, beer_name, brewery_name, i_name, i_type
from beer_list
where lower(beer_name) similar to '%' || lower(partial_name) || '%'
$$ language sql;


-- filter by beer id
create or replace function
	check_beer(beer_id integer) returns setof beer_list
as
$$
select beer_id, beer_name, brewery_name, i_name, i_type
from beer_list where beer_id = $1;
$$ language sql;


-- merge names of breweries
create or replace function
	merge_brewery(beer_id integer) returns text
as
$$
declare 
	bName text;
	result text;
	count integer;
begin
	result := '';
	count := 0;
	for bName in (select distinct brewery_name from check_beer(beer_id) order by brewery_name) loop
		result = result || bName;
		count := count + 1;
		if count < (select count(distinct brewery_name) from check_beer(beer_id)) then
			result = result || ' + ';
		end if;
	end loop;
	return result;
end;
$$ language plpgsql;

-- function to filter ingredient names and types and display them according to the specs
create or replace function
	extract_ingredients(beer_id integer) returns text
as
$$
declare 
	result text;
	count integer;
	iName text;
begin
	result := '';
	count := 0;
	if (select count(i_name) from check_beer(beer_id) where i_type = 'hop') > 0 then
		result = result || 'Hops: ';
		for iName in (select distinct i_name from check_beer(beer_id) where i_type = 'hop') loop
			result = result || iName;
			if iName <> (select max(i_name) from check_beer(beer_id) where i_type = 'hop')then
				result = result || ',';
			end if;
		end loop;
		count = count + 1;
	end if;
	
	if (select count(i_name) from check_beer(beer_id) where i_type = 'grain') > 0 then
		if count >= 1 then
			result = result || E'\n';
		end if;
		result = result || 'Grain: ';
		for iName in (select distinct i_name from check_beer(beer_id) where i_type = 'grain') loop
			result = result || iName;
			if iName <> (select max(i_name) from check_beer(beer_id) where i_type = 'grain')then
				result = result || ',';
			end if;
		end loop;
		count = count + 1;
	end if;

	if (select count(i_name) from check_beer(beer_id) where i_type = 'adjunct') > 0 then
		if count >= 1 then
			result = result || E'\n';
		end if;
		result = result || 'Extras: ';
		for iName in (select distinct i_name from check_beer(beer_id) where i_type = 'adjunct') loop
			result = result || iName;
			if iName <> (select max(i_name) from check_beer(beer_id) where i_type = 'adjunct')then
				result = result || ',';
			end if;
		end loop;
	end if;

	return result;
end;
$$ language plpgsql;



drop type if exists BeerData cascade;
create type BeerData as (beer text, brewer text, info text);

create or replace function
	Q9(partial_name text) returns setof BeerData
as
$$
declare 
	beer_num integer; 
	emp record;
	tup BeerData;
begin
	for beer_num in (select distinct beer_id from target_beers(partial_name)) loop
		select distinct b.name into tup.beer from beers b where b.id = beer_num;
		tup.brewer := merge_brewery from merge_brewery(beer_num);
		tup.info := extract_ingredients from extract_ingredients(beer_num);
		return next tup;
	end loop;
end;
$$ language plpgsql;


