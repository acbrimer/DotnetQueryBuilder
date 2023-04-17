--Simple select:

    SELECT
        [customers].[id] AS [id],
        [customers].[first_name] AS [Customer First Name],
        [customers].[last_name] AS [Customer Last Name],
        [customers].[total_orders] AS [Total Orders],
        [customers].[total_returns] AS [Total Returns],
        ([customers].[total_orders] - [customers].[total_returns]) AS [Kept Orders],
        (([customers].[total_returns] - [customers].[total_orders]) * 100) AS [Percent Orders Kept] 
    FROM
        [customers] AS [customers]

--Simple Join:

    SELECT
        [c].[id] AS [id],
        [c].[first_name] AS [Customer First Name],
        [c].[last_name] AS [Customer Last Name],
        COUNT([o].[id]) AS [Total Orders] 
    FROM
        [customers] AS [c] 
    INNER JOIN
        [orders] AS [o] 
            ON [c].[id] = [o].[customer_id] 
    GROUP BY
        [c].[id],
        [c].[first_name],
        [c].[last_name]

--Simple Where:

    SELECT
        [c].[id] AS [id],
        [c].[first_name] AS [Customer First Name],
        [c].[last_name] AS [Customer Last Name],
        COUNT([o].[id]) AS [Returned Orders] 
    FROM
        [customers] AS [c] 
    INNER JOIN
        [orders] AS [o] 
            ON [c].[id] = [o].[customer_id] 
    WHERE
        [o].[order_status] = 'returned' 
    GROUP BY
        [c].[id],
        [c].[first_name],
        [c].[last_name] 
    ORDER BY
        [c].[last_name] ASC,
        [c].[first_name] DESC

--Nested Select:

    SELECT
        [orders].[id] AS [id],
        [customers].[id] AS [Customer ID],
        [customers].[first_name] AS [Customer First Name],
        [customers].[last_name] AS [Customer Last Name],
        [orders].[total] AS [Total Orders],
        [orders].[created_timestamp] AS [created_timestamp],
        (SELECT
            [ca].[zip_code] 
        FROM
            [customer_address] AS [ca] 
        WHERE
            [customers].[id] = [ca].[customer_id] 
        ORDER BY
            [ca].[created_on] DESC) AS [Current Zip Code] 
    FROM
        [customers] AS [customers] 
    INNER JOIN
        [orders] AS [orders] 
            ON [customers].[id] = [orders].[customer_id]

--Complex Where:

    SELECT
        [customers].[id] AS [id],
        [customers].[first_name] AS [Customer First Name],
        [customers].[last_name] AS [Customer Last Name],
        ([customers].[weight] / [customers].[height]) 
    FROM
        [customers] AS [customers] 
    WHERE
        (
            (
                [customers].[first_name] LIKE 'sam' 
                AND [customers].[last_name] LIKE 'smith'
            ) 
            OR (
                [customers].[first_name] LIKE 'dave' 
                AND [customers].[last_name] LIKE 'smith'
            )
        )