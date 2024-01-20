<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    <xsl:template match="tei:teiHeader"/>
    
    <xsl:template match="tei:body">
        <div class="row">
            <div class="col-3"><br/><br/><br/><br/><br/>
                
            </div>
            <div class="col-9">
                <div class="transcription">
                    <xsl:apply-templates select="//tei:div"/>
                </div>
            </div>
        </div> 
    </xsl:template>    
    
    <xsl:template match="tei:div">
        <div class="#MWS"><xsl:apply-templates/></div>
    </xsl:template>
    
    <xsl:template match="tei:p">
        <p><xsl:apply-templates/></p>
    </xsl:template>
    
    
    <xsl:template match="tei:add[@place = 'marginleft']">
        <span class="marginAdd">
            <xsl:attribute name="auth">
                <xsl:value-of select="attribute::hand" />
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
  
    <xsl:template match="tei:add[@place != 'marginleft' and place != 'supralinear' and place != 'infralinear']">
        <span class="add">
            <xsl:attribute name="auth">
                <xsl:value-of select="attribute::hand" />
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:del">
        <del>
            <xsl:attribute name="class">
                <xsl:value-of select="@hand"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </del>
    </xsl:template>
    
    <!-- all the supralinear additions are given in a span with the class supraAdd, make sure to put this class in superscript in the CSS file, -->
    <xsl:template match="tei:add[@place = 'supralinear']">
        <span class="supraAdd">
            <xsl:attribute name="auth">
                <xsl:value-of select="attribute::hand" />
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:add[@place = 'infralinear']">
        <span class="infraAdd">
            <xsl:attribute name="auth">
                <xsl:value-of select="attribute::hand" />
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:add[@place = 'overwritten']">
        <span class="overwrittenAdd">
            <xsl:attribute name="auth">
                <xsl:value-of select="attribute::hand" />
            </xsl:attribute>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <!-- add additional templates below, for example to transform the tei:lb in <br/> empty elements, tei:hi[@rend = 'sup'] in <sup> elements, the underlined text, additions with the attribute "overwritten" etc. -->
    <xsl:template match="tei:lb">
        <br/>
    </xsl:template>
   
   <xsl:template match="tei:hi[@rend= 'sup']">
       <sup>
           <xsl:apply-templates/>
       </sup>
   </xsl:template>
    
    <xsl:template match="tei:hi[@rend= 'u']">
        <u>
            <xsl:apply-templates/>
        </u>
    </xsl:template>
   
    <xsl:template match="tei:del[@type= 'overwritten']">
        <s class="overwrittenDel">
            <xsl:apply-templates/>
        </s>
    </xsl:template>
    
    <xsl:template match="tei:note">
        <note>[note: <xsl:apply-templates/>]</note>
    </xsl:template>
    
    <xsl:template match="tei:metamark[@function='pagenumber']">
        <div display="block">
            <span class="pagenumber">
                <xsl:apply-templates/>
            </span><br/><br/>
        </div>
    </xsl:template>
    
    <xsl:template match="tei:metamark"><!--[@function != 'pagenumber'] -->
        <metamark><xsl:apply-templates/></metamark>
    </xsl:template>
    
    <xsl:template match="tei:choice">
        <choice><xsl:apply-templates/></choice>
    </xsl:template>
    
    <xsl:template match="tei:sic">
        <sic><xsl:apply-templates/></sic>
    </xsl:template>
    
    <xsl:template match="tei:corr">
        <corr><xsl:apply-templates/></corr>
    </xsl:template>

</xsl:stylesheet>
