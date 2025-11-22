-- Tạo database
CREATE DATABASE MyStore;
GO
USE MyStore;
GO

-------------------------------------------------------
-- Bảng User: quản lý tài khoản
-------------------------------------------------------
CREATE TABLE [dbo].[User] (
    [Username] NVARCHAR(100) NOT NULL,
    [Password] NVARCHAR(255) NOT NULL,
    [UserRole] CHAR(1) NOT NULL,  -- A = Admin, C = Customer
    PRIMARY KEY ([Username])
);

-------------------------------------------------------
-- Bảng Customer: thông tin khách hàng
-------------------------------------------------------
CREATE TABLE [dbo].[Customer] (
    [CustomerID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerName] NVARCHAR(200) NOT NULL,
    [CustomerPhone] NVARCHAR(15) NOT NULL,
    [CustomerEmail] NVARCHAR(200),
    [CustomerAddress] NVARCHAR(300),
    [Username] NVARCHAR(100) NOT NULL,
    CONSTRAINT FK_Customer_User FOREIGN KEY ([Username])
        REFERENCES [dbo].[User]([Username])
);

-------------------------------------------------------
-- Bảng Category: danh mục sách
-------------------------------------------------------
CREATE TABLE [dbo].[Category] (
    [CategoryID] INT IDENTITY(1,1) PRIMARY KEY,
    [CategoryName] NVARCHAR(200) NOT NULL
);

-------------------------------------------------------
-- Bảng Book (Product): thông tin sách
-------------------------------------------------------
CREATE TABLE [dbo].[Book] (
    [BookID] INT IDENTITY(1,1) PRIMARY KEY,
    [CategoryID] INT NOT NULL,
    [BookTitle] NVARCHAR(300) NOT NULL,
    [Description] NVARCHAR(MAX),
    [Price] DECIMAL(18,2) NOT NULL,
    [Image] NVARCHAR(300),
    [PublishYear] INT,           -- Có thể giữ lại
    [Stock] INT DEFAULT 0,       -- Tồn kho
    CONSTRAINT FK_Book_Category FOREIGN KEY ([CategoryID])
        REFERENCES [dbo].[Category]([CategoryID])
);

-------------------------------------------------------
-- Bảng Order: đơn hàng
-------------------------------------------------------
CREATE TABLE [dbo].[Order] (
    [OrderID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerID] INT NOT NULL,
    [OrderDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [TotalAmount] DECIMAL(18,2) NOT NULL,
    [PaymentStatus] NVARCHAR(50) NULL,  -- pending / paid / cancelled
    [DeliveryAddress] NVARCHAR(300) NOT NULL,
    CONSTRAINT FK_Order_Customer FOREIGN KEY ([CustomerID])
        REFERENCES [dbo].[Customer]([CustomerID])
);

-------------------------------------------------------
-- Bảng OrderDetail: chi tiết đơn hàng
-------------------------------------------------------
CREATE TABLE [dbo].[OrderDetail] (
    [ID] INT IDENTITY(1,1) PRIMARY KEY,
    [BookID] INT NOT NULL,
    [OrderID] INT NOT NULL,
    [Quantity] INT NOT NULL,
    [UnitPrice] DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_OrderDetail_Book FOREIGN KEY ([BookID])
        REFERENCES [dbo].[Book]([BookID]),
    CONSTRAINT FK_OrderDetail_Order FOREIGN KEY ([OrderID])
        REFERENCES [dbo].[Order]([OrderID])
);

-------------------------------------------------------
-- Bảng Review: đánh giá sách
-------------------------------------------------------
CREATE TABLE [dbo].[Review] (
    [ReviewID] INT IDENTITY(1,1) PRIMARY KEY,
    [BookID] INT NOT NULL,
    [CustomerID] INT NOT NULL,
    [Rating] INT CHECK (Rating BETWEEN 1 AND 5),
    [Comment] NVARCHAR(MAX),
    [ReviewDate] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([BookID]) REFERENCES [dbo].[Book]([BookID]),
    FOREIGN KEY ([CustomerID]) REFERENCES [dbo].[Customer]([CustomerID])
);

-------------------------------------------------------
-- Bảng ShoppingCart: giỏ hàng
-------------------------------------------------------
CREATE TABLE [dbo].[ShoppingCart] (
    [CartID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerID] INT NOT NULL,
    [BookID] INT NOT NULL,
    [Quantity] INT NOT NULL,
    FOREIGN KEY ([CustomerID]) REFERENCES [dbo].[Customer]([CustomerID]),
    FOREIGN KEY ([BookID]) REFERENCES [dbo].[Book]([BookID])
);

-------------------------------------------------------
-- Set quyền cho sa
-------------------------------------------------------
ALTER AUTHORIZATION ON DATABASE::MyStore TO sa;
GO
