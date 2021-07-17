import sqlite3
import typing
import os


class SQL:
    def __init__(self):
        path = os.path.realpath(os.path.dirname(__file__))
        path_full = os.path.join(path, "db/database.db")
        self.conn = sqlite3.connect(path_full, check_same_thread=False)
        self.cursor = self.conn.cursor()

    # // cria qualquer tabela

    def create_table(self, name_table: str, **kwargs):
        cont_dict = len(kwargs.items())
        sintaxe = f"CREATE TABLE IF NOT EXISTS {name_table} ("
        for name_col, attr in kwargs.items():
            cont_dict -= 1
            sintaxe = sintaxe + (
                name_col + " " + attr.upper() + (
                    ", " if cont_dict > 0 else ""
                )
            )
        self.cursor.execute(sintaxe + ");")
        self.conn.commit()
    
    # // insere em qualquer tabela ja criada...
    
    def insert_in_table(
        self, table: str, 
        cols: typing.Iterable=list(), 
        values: typing.Iterable=list()
        ):
        sintaxe = f"INSERT INTO {table} {cols} VALUES {values};".replace(
            "[", "(").replace("]", ")"
        )
        self.cursor.execute(sintaxe)
        self.conn.commit()

    # // busca valores especificos em qualquer campo

    def get_table_data(
        self, table: str, 
        col_name: str, value: str, 
        all: bool=False, 
        order: str = str()):
        select = self.cursor.execute(
            f"SELECT * FROM {table} WHERE {col_name} = ? LIMIT 30;", 
            [value,]
        )
        if all: return select.fetchall()
        else: return select.fetchone()


    def delete_table(self, table: str, cols: str, items: str):
        self.cursor.execute(
            f"DELETE FROM {table} WHERE {cols} = ?;", [items,]
        )
        self.conn.commit()


    def delete_all(self, table: str):
        self.cursor.execute(f"DELETE FROM {table};")
        self.conn.commit()

    def query_like(self, arg: str):
        ret = self.cursor.execute(f"SELECT * FROM noticias WHERE titulo LIKE '%{arg}%' ORDER BY DATE(data) DESC;")
        return ret


    def personal(self, sql: str=None, args:list=None):
        if sql:
            self.cursor.execute(sql, args)
            self.conn.commit()
        else:
            return self.cursor