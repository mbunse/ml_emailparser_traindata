
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

Base = declarative_base()

class Zonetype(Base):
    __tablename__ = 'zonetypes'
    id = Column(Integer, primary_key=True)
    name = Column(String)

    def __repr__(self):
       return f"<Zonetype(name='{self.name}')>"

class Zoneline(Base):
    __tablename__ = 'zonelines'
    id = Column(Integer, primary_key=True)
    messageid = Column(Integer, ForeignKey('bodies.messageid'))
    linetext = Column(String)
    lineorder = Column(Integer)
    zoneannotation = relationship("Zoneannotation", uselist=False, back_populates="zoneline")
    body = relationship("Body", uselist=False, back_populates="zonelines")
    def __repr__(self):
       return f"<Zoneline(messageid='{self.messageid}', linetext='{self.linetext}', lineorder='{self.lineorder}')>"

class Zoneannotation(Base):
    __tablename__ = 'zoneannotations'
    id = Column(Integer, primary_key=True)
    messageid = Column(Integer, ForeignKey('bodies.messageid'))
    lineid = Column(Integer, ForeignKey('zonelines.id'))
    zoneline = relationship("Zoneline", uselist=False, back_populates="zoneannotation")
    userid = Column(Integer)
    datetime = Column(DateTime)
    annvalue = Column(Integer, ForeignKey('zonetypes.id'))
    zonetype = relationship("Zonetype")
    errorid = Column(String, ForeignKey('errortypes.id'))
    errortype = relationship("Errortype")

    def __repr__(self):
       return f"<Zoneannotation(messageid='({self.messageid})', lineid='{self.lineid}', nicknannvalueame='({self.nicknannvalueame})')>"

class Errortype(Base):
    __tablename__ = 'errortypes'
    id = Column(String, primary_key=True)
    name = Column(String)

    def __repr__(self):
       return f"<Zonetype(name='{self.name}')>"
   
class Header(Base):
    __tablename__ = 'headers'
    headerid = Column(Integer, primary_key=True)
    messageid = Column(Integer, ForeignKey('bodies.messageid'))
    headername = Column(String)
    headervalue = Column(String)
    body = relationship("Body", back_populates="headers")

    def __repr__(self):
       return f"<Header(headername='{self.headername}', headervalue='{self.headervalue}')>"

class Body(Base):
    __tablename__ = 'bodies'
    messageid = Column(Integer, primary_key=True)
    body = Column(String)
    zonelines = relationship("Zoneline", order_by=Zoneline.lineorder, back_populates="body")
    zoneannotations = relationship("Zoneannotation", order_by=Zoneannotation.id)
    headers = relationship("Header", order_by=Header.headerid, back_populates="body")
    subject_header = relationship("Header", uselist=False, primaryjoin="and_(Header.headername=='Subject', "
        "Header.messageid==Body.messageid)")
    @hybrid_property
    def subject(self):
        return self.subject_header.headervalue

    date_header = relationship("Header", uselist=False, primaryjoin="and_(Header.headername=='Date', "
        "Header.messageid==Body.messageid)")
    @hybrid_property
    def date(self):
        return self.date_header.headervalue

    from_header = relationship("Header", uselist=False, primaryjoin="and_(Header.headername=='From', "
        "Header.messageid==Body.messageid)")
    @hybrid_property
    def from_(self):
        return self.from_header.headervalue

    to_header = relationship("Header", uselist=False, primaryjoin="and_(Header.headername=='To', "
        "Header.messageid==Body.messageid)")
    @hybrid_property
    def to_(self):
        return self.to_header.headervalue
    def __repr__(self):
       return f"<Body(body='{self.body}')>"

